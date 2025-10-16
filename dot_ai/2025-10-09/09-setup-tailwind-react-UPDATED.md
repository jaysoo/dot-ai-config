# How do I set up Tailwind and React?

Setting up Tailwind CSS in a React application within an Nx workspace is straightforward. This guide shows how to configure Tailwind CSS in your React applications.

## Automated Setup (Recommended)

The `setup-tailwind` generator can be used to add [Tailwind](https://tailwindcss.com) configuration to apps and publishable libraries:

```shell
nx g @nx/react:setup-tailwind --project=<your-app-name>
```

Replace `<your-app-name>` with your React application name.

### What the Generator Does

This generator will automatically:

- Install the necessary Tailwind CSS dependencies
- Add a `postcss.config.js` file with Tailwind configuration
- Add a `tailwind.config.js` file for customization
- Configure your application to process Tailwind CSS

## Using Tailwind in Your App

After setup, you can immediately use Tailwind class names and utilities in your React components:

```jsx
function Hello() {
  return <div className="bg-indigo-500 p-2 font-mono">Hello!</div>;
}
```

## Manual Setup

If you prefer to set up Tailwind manually or the generator doesn't work for your use case, you can follow the manual installation steps outlined in the official Tailwind CSS documentation.

## Customization

After setup, you can customize Tailwind by editing:

- `tailwind.config.js` - Configure theme, plugins, and content paths
- `postcss.config.js` - Adjust PostCSS processing

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed: `npm install` or `yarn install`
2. Check that your build process includes PostCSS
3. Verify the content paths in `tailwind.config.js` include your source files
4. Clear any build caches and rebuild your application

## Learn More

For a comprehensive guide on using Tailwind CSS with React in Nx, see:
- [Using Tailwind CSS with React](/docs/technologies/react/guides/using-tailwind-css-in-react)
