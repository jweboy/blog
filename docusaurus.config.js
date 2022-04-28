/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'jweboy blog',
  tagline: '努力成为一个写得了一手好代码、做得了一手好菜的程序猿',
  url: 'https://jweboy.com',
  baseUrl: '/blog/',
  favicon: 'img/favicon.ico',

  onBrokenLinks: 'throw', // 检测无效链接
  onBrokenMarkdownLinks: 'warn', // 检测无效 Markdown 链接
  organizationName: 'jweboy', // 组织名称
  // projectName: 'blog',
  plugins: ['@docusaurus/theme-live-codeblock'], // 插件
  themeConfig: {
    colorMode: {
      defaultMode: 'dark', // 主题颜色
      respectPrefersColorScheme: true, // 主题颜色跟随系统变化
    },
    liveCodeBlock: { // 实时编辑的代码块
      playgroundPosition: 'bottom', // 代码块位置
    },
    // algolia: {
    //   searchPagePath: true,
    // },
    navbar: {
      title: 'jweboy blog',
      logo: {
        alt: '知识积累图标',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs',
          label: '前端积累',
          position: 'right',
        },
        {
          to: 'blog',
          label: '日常积累',
          position: 'right',
          items: [
            {
              label: 'linux',
              href: '/blog/blog/linux'
            },
          ],
        },
        {
          href: 'http://jweboy.com:3001',
          label: '项目展示',
          position: 'right',
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
              href: 'https://assets.jweboy.com/pdf/web%E5%89%8D%E7%AB%AF-%E8%92%8B%E7%A3%8A%E7%9A%84%E7%AE%80%E5%8E%86-20210206.pdf',
            }
          ]
        },
        {
          label: '分享PPT',
          position: 'right',
          items: [
             { label: 'AST', href: 'https://assets.jweboy.com/pdf/AST%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86.pdf' },
            { label: 'Docker', href: 'https://assets.jweboy.com/pdf/docker%E5%88%9D%E6%8E%A2.pdf' },
            { label: 'Flutter', href: 'https://assets.jweboy.com/pdf/flutter%E5%88%9D%E4%BD%93%E9%AA%8C.pdf' },
          ]
        },
        {
          href: 'http://nas.jweboy.online:30000/',
          label: 'Gitlab',
          position: 'right',
        },
        {
          href: 'https://juejin.cn/user/2805609402235149/posts',
          label: '掘金',
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
          blogSidebarTitle: '全部博文',
          blogSidebarCount: 'ALL',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
