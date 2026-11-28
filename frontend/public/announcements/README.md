# Announcement Carousel Images

## Instructions

Add your announcement images to this folder with the following names:
- `slide1.jpg` - First announcement slide
- `slide2.jpg` - Second announcement slide
- `slide3.jpg` - Third announcement slide

## Image Specifications

- **Recommended size**: 1200px × 500px
- **Format**: JPG, PNG, or WebP
- **Aspect ratio**: 2.4:1 (landscape)
- **File size**: Keep under 500KB for fast loading

## Adding More Slides

To add more slides, edit the `ANNOUNCEMENT_SLIDES` array in:
`frontend/src/pages/HomePage.jsx`

Add a new slide object:
```javascript
{
  id: 4,
  image: '/announcements/slide4.jpg',
  title: 'Your Title Here',
  description: 'Your description here',
  tag: 'Event' // or 'Update', 'Info', etc.
}
```

## Tips

- Use high-quality images with good lighting
- Ensure text in the images is readable
- Keep file names exactly as specified (case-sensitive)
- If an image fails to load, a placeholder will show instead
