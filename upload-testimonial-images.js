const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpp9kkp3',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadTestimonialImages() {
  const images = [
    { localPath: 'public/review_person_images/Jivraj.png', publicId: 'testimonials/Jivraj' },
    { localPath: 'public/review_person_images/NIk.png', publicId: 'testimonials/NIk' }
  ];

  console.log('Uploading testimonial images to Cloudinary...');

  for (const image of images) {
    try {
      const result = await cloudinary.uploader.upload(image.localPath, {
        public_id: image.publicId,
        folder: 'testimonials',
        resource_type: 'image'
      });
      
      console.log(`✅ Uploaded ${image.publicId}:`);
      console.log(`   URL: ${result.secure_url}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Failed to upload ${image.publicId}:`, error.message);
    }
  }
}

uploadTestimonialImages();
