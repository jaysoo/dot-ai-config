# How do I set up Tailwind and React?

Setting up Tailwind CSS in a React application within an Nx workspace can be done automatically using a generator or manually.

## Automated Setup (Recommended)

The easiest way to set up Tailwind is using the `@nx/react:setup-tailwind` generator:

```shell
nx g @nx/react:setup-tailwind --project=<your app here>
```

Replace `<your app here>` with your React application name.

### What the Generator Does

This generator will:

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

If you prefer to set up Tailwind manually or the generator doesn't work for your use case, you can follow the manual installation steps outlined in the [official Tailwind CSS documentation](https://tailwindcss.com/docs/installation).

## Next.js Projects

The same generator works for Next.js applications:

```shell
nx g @nx/react:setup-tailwind --project=my-next-app
```

For more details on using Tailwind with Next.js in Nx, check out the blog post: [Setting up Next.js to use Tailwind with Nx](https://blog.nrwl.io/setup-next-js-to-use-tailwind-with-nx-849b7e21d8d0).

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
