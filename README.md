# Llama Chat 🦙

This is a [Next.js](https://nextjs.org/) app that demonstrates how to build a chat UI using the [Llama 3](https://replicate.com/meta/llama-3-70b-chat) language model and Replicate's [streaming API (private beta)](https://replicate.com/docs/streaming).

## Security Features

- Rate limiting: 50 requests per minute per IP
- Input validation for all API parameters
- Secure environment variable handling
- Content Security Policy (CSP) headers
- Protection against common web vulnerabilities
- No client-side API token exposure

Here's a demo:

https://github.com/replicate/llama-chat/assets/14149230/e700b256-dc34-4c4e-b912-8a84ec4bec6a

## Setup

1. Get your [Replicate API token](https://replicate.com/account#token)

2. Set up environment variables:

   For local development, create a `.env.local` file:
   ```bash
   REPLICATE_API_TOKEN=<your-token-here>
   ```

   For Vercel deployment, add the environment variable in your project settings:
   - Go to Project Settings > Environment Variables
   - Add `REPLICATE_API_TOKEN` with your API token
   - **IMPORTANT**: Never commit your API token or expose it in client-side code

3. Configure your domain in `app/layout.js`:
   - Update the `metadataBase` URL to your actual domain
   - Adjust CSP headers if needed for additional domains

## Development

Install dependencies:

```console
npm install
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production Deployment

1. Ensure all environment variables are properly set
2. Configure your web server to:
   - Forward real IP addresses (for rate limiting)
   - Enable HTTPS
   - Set recommended security headers

## Security Best Practices

1. Keep dependencies updated:
   ```bash
   npm audit
   npm update
   ```

2. Monitor application logs for suspicious activity

3. Regularly review and update rate limits based on usage patterns

4. Follow security advisories for Next.js and dependencies

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)
