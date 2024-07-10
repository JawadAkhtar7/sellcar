//@ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { PhotoCamera, Delete, Logout } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { RotatingLines } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

const VehicleForm = () => {
  const { handleSubmit, control, watch, setValue, formState: { errors }, reset } = useForm();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const maxPictures = watch('maxPictures');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(()=>{
    if(localStorage.getItem("token")===null || localStorage.getItem("token")===undefined){
      router.push("/");
    }
  },[]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        throw new Error('User not authenticated');
      }
      const decoded: any = jwtDecode(token);
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('userId', JSON.stringify(decoded.userId));

      const images = data.images;
      if (images && images.length > 0) {
        images.forEach((image: File) => {
          formData.append('images', image);
        });
      }

      const response = await fetch('/api/vehicle', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        reset({ model: '', price: '', phone: '', city: '', maxPictures: '' });
        setPreviewImages([]);
        setValue('images', []);
        alert('Vehicle information submitted successfully!');
      } else {
        setLoading(false);
        throw new Error('Failed to submit vehicle information');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message) {
        alert(error.message);
      } else {
        alert('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const currentImages = watch('images') || [];
      const newImages = Array.from(files).slice(0, maxPictures - currentImages.length);
      const updatedImages = [...currentImages, ...newImages];
      setValue('images', updatedImages);
      setPreviewImages(updatedImages.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    setValue(
      'images',
      updatedImages.map((src, i) => {
        return new File([src], `image-${i}`);
      })
    );
  };

  const images = watch('images') || [];

  return (
    <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f0f0f0', borderRadius: 2 }}>
      <Grid container marginBottom={5} alignItems="center" justifyContent="space-between">
        <Typography variant="h5" >
          Submit Vehicle Information
        </Typography>
        <Button
          variant="contained"
          color="info"
          component="span"
          startIcon={<Logout />}
          onClick={()=>{
            localStorage.removeItem("token");
            router.push('/');
          }}
        >
          Logout
        </Button>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="model"
              control={control}
              rules={{ required: 'Car model is required', minLength: { value: 3, message: 'Minimum 3 characters required' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Car Model"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.model}
                  helperText={errors.model ? errors.model.message : ''}
                  />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              rules={{ required: 'Price is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price - PKR"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.price}
                  helperText={errors.price ? errors.price.message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Phone number is required',
                minLength: { value: 11, message: 'Must be 11 digits' },
                maxLength: { value: 11, message: 'Must be 11 digits' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.phone}
                  helperText={errors.phone ? errors.phone.message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.city}
                  helperText={errors.city ? errors.city.message : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="maxPictures"
              control={control}
              rules={{ required: 'Max number of pictures is required', min: 1, max: 10 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Max number of pictures"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.maxPictures}
                  helperText={errors.maxPictures ? 'Number of pictures must be between 1 and 10' : ''}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              name='images'
              accept="image/*"
              id="upload-images"
              type="file"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={images.length >= maxPictures}
            />
            <label htmlFor="upload-images">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={images.length >= maxPictures}
              >
                Upload Images
              </Button>
            </label>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {previewImages.map((src, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    width={100}
                    height={100}
                    style={{ borderRadius: 4 }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => handleImageRemove(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {
                loading === false ? 'Submit'
                :
                <RotatingLines
                  visible={true}
                  width="30"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  strokeColor="grey"
                  />
              }
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default VehicleForm;
