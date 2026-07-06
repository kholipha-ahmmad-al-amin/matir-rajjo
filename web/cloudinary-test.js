const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with the credentials provided
cloudinary.config({
  cloud_name: 'ayszv1op',
  api_key: '869465586114721',
  api_secret: '4BAwsXG851BAT4AoCsNVIVX-Xhw'
});

async function run() {
  try {
    console.log("Uploading image...");
    
    // Upload a sample image from Cloudinary's demo domain
    const uploadResult = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', {
      public_id: 'matir_rajjo_sample'
    });
    
    console.log("\n--- Upload Successful ---");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);
    
    console.log("\n--- Image Details ---");
    console.log("Width:", uploadResult.width);
    console.log("Height:", uploadResult.height);
    console.log("Format:", uploadResult.format);
    console.log("File Size (bytes):", uploadResult.bytes);
    
    // Generate a transformed version of the image URL
    // f_auto: Automatically selects the most efficient image format (e.g., WebP, AVIF) based on the browser.
    // q_auto: Automatically adjusts the compression quality to minimize file size without noticeable visual degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });
    
    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log("Transformed URL:", transformedUrl);
    
  } catch (error) {
    console.error("Error during Cloudinary operations:", error);
  }
}

run();
