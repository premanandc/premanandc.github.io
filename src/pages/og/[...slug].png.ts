import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import type { ReactNode } from 'react';
import satori from 'satori';
import sharp from 'sharp';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, tags: post.data.tags },
  }));
}

export async function GET({ props }: APIContext) {
  const { title, tags } = props as { title: string; tags: string[] };

  const fontData = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap'
  ).then((res) => res.text())
    .then((css) => {
      const url = css.match(/src: url\(([^)]+)\)/)?.[1];
      return url ? fetch(url).then((res) => res.arrayBuffer()) : null;
    });

  if (!fontData) {
    return new Response('Font loading failed', { status: 500 });
  }

  const svg = await satori(
    ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
          padding: '60px',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '8px',
                    },
                    children: tags.slice(0, 3).map((tag) => ({
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#0d9488',
                          background: 'rgba(13, 148, 136, 0.08)',
                          border: '1px solid rgba(13, 148, 136, 0.2)',
                          borderRadius: '99px',
                          padding: '4px 14px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: title.length > 50 ? '48px' : '56px',
                      fontWeight: 800,
                      color: '#1c1917',
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '900px',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#1c1917',
                          },
                          children: 'Prem Chandrasekaran',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0d9488',
                    },
                    children: 'premonition.dev',
                  },
                },
              ],
            },
          },
        ],
      },
    } as unknown as ReactNode),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
