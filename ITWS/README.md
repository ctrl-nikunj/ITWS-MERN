# StegoScramble: Inverse-Transpose Wavelet Scrambling

StegoScramble is a modern web application built with Next.js 16 that implements advanced steganography techniques to hide secret images within cover images. It utilizes Inverse-Transpose Wavelet Scrambling to ensure that the hidden data is invisible to the naked eye and robust against detection.

![Hero Image](/hero-stego.jpg)

## Features

- **Advanced Steganography**: Hide secret images inside cover images using sophisticated pixel scrambling algorithms.
- **Inverse-Transpose Wavelet Scrambling**: A unique technique that combines wavelet transforms with transposition and scrambling for enhanced security.
- **Client-Side Processing**: Utilizes Web Workers for efficient image processing without blocking the main thread.
- **Modern UI/UX**: Built with React 19, Tailwind CSS 4, and Radix UI for a sleek, responsive, and accessible user interface.
- **Real-time Preview**: Visualize the cover and secret images before processing.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Image Processing**: `jimp`, `dct2`, `discrete-wavelets`

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/stego-scramble.git
    cd frontend-next
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  **Upload Cover Image**: Select the image you want to use as a container.
2.  **Upload Secret Image**: Select the image you want to hide.
3.  **Process**: Click the button to embed the secret image into the cover image.
4.  **Download**: Save the resulting steganographic image.
5.  **Extract**: Use the extraction tool to recover the secret image from the steganographic image.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (`StegoProcessor`, `TechniqueSection`, etc.).
- `src/lib`: Utility functions and worker scripts for image processing.
- `public`: Static assets.

## License

This project is licensed under the MIT License.
