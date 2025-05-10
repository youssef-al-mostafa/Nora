import { ImgHTMLAttributes, SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const { suppressHydrationWarning, ...imageProps } = props;
    return (
        <img
            src="/favicon.ico"
            alt="App Logo"
            {...imageProps as ImgHTMLAttributes<HTMLImageElement>}
        />
    );
}
