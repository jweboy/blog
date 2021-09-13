/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'biubiubiu的博客',
  tagline: '努力成为一个写得了一手好代码、做得了一手好菜的程序猿',
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
        // {
        //   to: 'linux',
        //   label: 'Linux',
        //   position: 'left',
        // },
        {
          to: 'blog',
          label: '技术文章',
          position: 'left',
        },
        {
          to: 'docs/resume',
          label: '简历',
          position: 'right',
          items: [
            {
              label: 'Markdown',
              href: '/docs/resume'
            },
            {
              label: 'PDF',
              href: 'https://assets.jweboy.com/pdf/resume.pdf',
            }
          ]
        },
        {
          label: '分享PPT',
          position: 'right',
          items: [
             { label: 'AST', href: 'https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/AST%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86.pdf' },
            { label: 'Docker', href: 'https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/docker%E5%88%9D%E6%8E%A2.pdf' },
            { label: 'Flutter', href: 'https://biubiubiu.frontend.obs.cn-east-3.myhuaweicloud.com/flutter%E5%88%9D%E4%BD%93%E9%AA%8C.pdf' },
          ]
        },
        {
          href: 'http://nas.jweboy.online:30000/',
          label: 'Gitlab',
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
