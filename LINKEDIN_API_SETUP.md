# LinkedIn Posts Integration Guide

The website now includes a LinkedIn posts section that displays your latest posts. Currently, it shows sample posts, but you can integrate the real LinkedIn API to fetch your actual posts.

## Current Setup

The website displays sample posts from the `/api/linkedin-posts` endpoint. These are placeholder posts that demonstrate the design and functionality.

## Option 1: LinkedIn API Integration (Recommended)

To fetch real LinkedIn posts, you'll need to:

### Step 1: Create a LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Note your **Client ID** and **Client Secret**

### Step 2: Request API Permissions
Request the following permissions:
- `r_liteprofile` - Basic profile information
- `r_basicprofile` - Full profile information
- `r_organization_social` - Organization posts (if posting as a company)
- `w_member_social` - Write access (if needed)

### Step 3: Install Required Packages
```bash
npm install axios
```

### Step 4: Update the API Endpoint
Update `routes/api.js` to use LinkedIn API:

```javascript
const axios = require('axios');

router.get('/linkedin-posts', async (req, res) => {
    try {
        const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
        
        if (!accessToken) {
            return res.json({
                success: false,
                message: 'LinkedIn API not configured'
            });
        }

        // Fetch posts from LinkedIn API
        const response = await axios.get('https://api.linkedin.com/v2/ugcPosts', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            },
            params: {
                q: 'authors',
                authors: 'urn:li:person:YOUR_PERSON_URN'
            }
        });

        // Transform LinkedIn API response to our format
        const posts = response.data.elements.map(post => ({
            id: post.id,
            text: post.specificContent.shareContent.text.text,
            timestamp: post.created.time,
            likes: post.numLikes || 0,
            comments: post.numComments || 0,
            shares: post.numShares || 0,
            url: `https://www.linkedin.com/feed/update/${post.id}`
        }));

        res.json({ success: true, posts });
    } catch (error) {
        console.error('LinkedIn API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### Step 5: Add Environment Variables
Add to your `.env` file:
```
LINKEDIN_ACCESS_TOKEN=your_access_token_here
```

## Option 2: Manual Posts (Simple Alternative)

If LinkedIn API integration is too complex, you can manually update the posts in `routes/api.js`:

```javascript
router.get('/linkedin-posts', async (req, res) => {
    const posts = [
        {
            id: '1',
            text: 'Your actual post text here...',
            timestamp: new Date('2024-01-15').toISOString(),
            likes: 45,
            comments: 8,
            shares: 3,
            url: 'https://www.linkedin.com/posts/your-post-url'
        },
        // Add more posts...
    ];
    
    res.json({ success: true, posts });
});
```

## Option 3: Use LinkedIn RSS Feed (If Available)

Some LinkedIn profiles have RSS feeds. You can parse the RSS feed:

```bash
npm install rss-parser
```

```javascript
const Parser = require('rss-parser');
const parser = new Parser();

router.get('/linkedin-posts', async (req, res) => {
    try {
        const feed = await parser.parseURL('YOUR_LINKEDIN_RSS_FEED_URL');
        const posts = feed.items.slice(0, 5).map(item => ({
            id: item.guid,
            text: item.contentSnippet,
            timestamp: item.pubDate,
            url: item.link
        }));
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

## Testing

1. Start your server: `npm start`
2. Visit: `http://localhost:3000/api/linkedin-posts`
3. You should see JSON with posts data
4. The posts will automatically display on the website

## Notes

- LinkedIn API requires OAuth 2.0 authentication
- Access tokens expire and need to be refreshed
- Rate limits apply to LinkedIn API calls
- Consider caching posts to reduce API calls

