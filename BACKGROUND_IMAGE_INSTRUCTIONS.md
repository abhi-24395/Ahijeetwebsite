# Background Image Setup

To use the Opsion comic book cover as your background:

1. **Save the image**: Save the Opsion comic book cover image as `opsion-background.jpg`

2. **Place it in the public folder**: 
   - Copy the image to: `public/opsion-background.jpg`
   - The server is configured to serve files from the `public` folder

3. **Alternative**: If you want to use a different filename or path:
   - Edit `views/index.html`
   - Find the line: `url('/opsion-background.jpg'),`
   - Replace with your image path (e.g., `url('/your-image.jpg')`)

4. **Image recommendations**:
   - Recommended size: 1920x1080 or larger
   - Format: JPG, PNG, or WebP
   - The image will be used as a fixed background with overlay effects

The website is already configured with the cyberpunk color scheme matching the comic book aesthetic!

