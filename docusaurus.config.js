/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'biubiubiu的博客',
  tagline: 'The tagline of my site',
  url: 'https://jweboy.com/blog',
  baseUrl: '/blog/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'jweboy', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.
  plugins: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    liveCodeBlock: {
      /**
       * 实时效果显示的位置，可位于编辑器上方或下方。
       * 可为："top" | "bottom"
       */
      playgroundPosition: 'bottom',
    },
    navbar: {
      title: 'biubiubiu的博客',
      logo: {
        alt: '知识积累图标',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs',
          // activeBasePath: 'docs',
          label: '前端知识点积累',
          position: 'left',
        },
        {
          to: 'blog',
          label: '技术文章',
          position: 'left',
        },
        {
          to: 'docs/resume',
          label: '简历',
          position: 'right'
        },
        {
          href: 'https://github.com/jweboy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
