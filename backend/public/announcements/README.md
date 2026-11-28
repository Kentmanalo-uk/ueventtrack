# Announcement Carousel Images

This folder contains the carousel images displayed on the mobile app dashboard.

## Images
- `slide1.png` - University Student Government slide
- `slide2.png` - Student Leadership slide  
- `slide3.png` - Join USG Events slide

## Mobile App Access
These images are accessed by the mobile app via:
- https://ueventtrack.online/announcements/slide1.png
- https://ueventtrack.online/announcements/slide2.png
- https://ueventtrack.online/announcements/slide3.png

## Image Specifications
- Recommended size: 1200x675 (16:9 aspect ratio)
- Format: PNG or JPEG
- Mobile display: 320x180px (scaled down from original)

## Deployment
When deploying updates:
1. Replace images in this folder
2. Keep the same filenames or update the ANNOUNCEMENT_SLIDES array in USG_app/App.jsx
3. Clear any CDN cache if applicable
