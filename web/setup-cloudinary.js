const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ayszv1op',
  api_key: '869465586114721',
  api_secret: '4BAwsXG851BAT4AoCsNVIVX-Xhw'
});

async function createPreset() {
  try {
    const result = await cloudinary.api.create_upload_preset({
      name: "matir_rajjo_unsigned",
      unsigned: true,
      folder: "matir_rajjo",
    });
    console.log("Preset created successfully:", result);
  } catch (error) {
    if (error.error && error.error.message && error.error.message.includes('already exists')) {
      console.log("Preset already exists. That's fine.");
    } else {
      console.error("Error creating preset:", error);
    }
  }
}

createPreset();
