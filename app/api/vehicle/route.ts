import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import supabase from '@/app/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const jsonData = JSON.parse(formData.get('data') as string);
    const userId = JSON.parse(formData.get('userId') as string);

    const model = jsonData.model as string;
    const price = parseFloat(jsonData.price as string);
    const phone = jsonData.phone as string;
    const city = jsonData.city as string;
    const maxPictures = parseInt(jsonData.maxPictures as string, 10);
    const images = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    // Upload images to Supabase bucket and save live URL in database
    for (const image of images) {
      const fileName = `public/${new Date().valueOf()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle_pictures')
        .upload(fileName, image);

      if (error) {
        console.log("Supabase file upload error",error.message);
        return new NextResponse('Error uploading image to Supabase', { status: 500 });
      }

      const publicURL = supabase.storage.from('vehicle_pictures').getPublicUrl(fileName);
      imageUrls.push(publicURL.data.publicUrl);
    }

    // Save data to MongoDB
    const client = await clientPromise;
    const db = client.db('sellcar');
    const collection = db.collection('vehicles');

    await collection.insertOne({
      userId,
      model,
      price,
      phone,
      city,
      maxPictures,
      images: imageUrls,
    });

    return new NextResponse('Vehicle information submitted successfully', { status: 200 });
  } catch (error) {
    return new NextResponse('Error saving data to MongoDB', { status: 500 });
  }
}
