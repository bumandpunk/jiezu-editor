import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'Pascal 编辑器和 Pascal 平台的隐私政策',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/terms"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="font-medium text-foreground">隐私政策</span>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="mb-2 font-bold text-3xl">隐私政策</h1>
          <p className="mb-8 text-muted-foreground text-sm">生效日期：2026年2月20日</p>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">1. 简介</h2>
            <p className="text-foreground/90 leading-relaxed">
              Pascal Group Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
              Pascal Editor and Platform at pascal.app. This Privacy Policy explains how we collect,
              use, and protect your information when you use our services.
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">2. 我们收集的信息</h2>

            <h3 className="mt-4 font-medium text-lg">账户信息</h3>
            <p className="text-foreground/90 leading-relaxed">
              当您创建账户时，我们收集：
            </p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>电子邮件地址</li>
              <li>姓名</li>
              <li>头像/个人图片</li>
              <li>OAuth 提供方数据（通过 Google 登录时来自 Google）</li>
            </ul>

            <h3 className="mt-4 font-medium text-lg">项目数据</h3>
            <p className="text-foreground/90 leading-relaxed">
              当您使用本平台时，我们存储您的项目，包括 3D 建筑设计、平面图及相关元数据。
            </p>

            <h3 className="mt-4 font-medium text-lg">使用分析</h3>
            <p className="text-foreground/90 leading-relaxed">
              我们使用 Vercel Analytics 和 Speed Insights 收集匿名使用数据，包括页面浏览量、性能指标和常规使用模式，以帮助我们改进平台。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">3. 我们如何使用您的信息</h2>
            <p className="text-foreground/90 leading-relaxed">我们将您的信息用于：</p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>提供并维护您的账户</li>
              <li>在各设备间存储和同步您的项目</li>
              <li>根据使用模式改进我们的服务</li>
              <li>发送有关新功能和更新的可选电子邮件通知（可在设置中取消订阅）</li>
              <li>响应支持请求</li>
              <li>确保平台安全并防止滥用</li>
            </ul>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">4. 数据存储</h2>
            <p className="text-foreground/90 leading-relaxed">
              您的数据通过 Supabase（PostgreSQL 数据库）存储在安全的云基础设施中。我们实施适当的技术和组织措施来保护您的数据。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">5. 第三方服务</h2>
            <p className="text-foreground/90 leading-relaxed">
              我们使用以下第三方服务来运营平台：
            </p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>
                <strong>Google</strong> - 登录 OAuth 认证
              </li>
              <li>
                <strong>Vercel</strong> - 应用托管、分析和性能监控
              </li>
              <li>
                <strong>Supabase</strong> - 数据库托管和认证基础设施
              </li>
            </ul>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              上述每项服务均有其自己的隐私政策，规范其对您数据的处理方式。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">6. Cookie</h2>
            <p className="text-foreground/90 leading-relaxed">
              我们仅使用平台运作所必需的最少 Cookie：
            </p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>
                <strong>会话 Cookie</strong> - 认证和保持登录状态所必需
              </li>
              <li>
                <strong>分析 Cookie</strong> - 由 Vercel Analytics 用于收集匿名使用数据
              </li>
            </ul>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">7. 您的权利</h2>
            <p className="text-foreground/90 leading-relaxed">您有权：</p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>访问我们持有的您的个人数据</li>
              <li>请求更正不准确的数据</li>
              <li>请求删除您的数据</li>
              <li>导出您的项目数据</li>
              <li>退出营销通讯</li>
            </ul>
            <p className="mt-4 text-foreground/90 leading-relaxed">
              要行使上述任何权利，请联系我们：{' '}
              <a
                className="text-foreground underline hover:text-foreground/80"
                href="mailto:support@pascal.app"
              >
                support@pascal.app
              </a>
              .
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">8. 数据保留</h2>
            <p className="text-foreground/90 leading-relaxed">
              只要您的账户处于活跃状态，我们将保留您的数据。如果您删除账户，我们将在 30 天内删除您的个人数据和项目数据，除非法律要求我们保留某些信息。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">9. 儿童隐私</h2>
            <p className="text-foreground/90 leading-relaxed">
              本平台不面向 13 岁以下儿童。我们不会故意收集 13 岁以下儿童的个人信息。如果您认为我们收集了此类信息，请立即联系我们。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">10. 本政策的变更</h2>
            <p className="text-foreground/90 leading-relaxed">
              我们可能会不时更新本隐私政策。我们将通过在平台上发布更新后的政策来通知您重大变更。变更发布后，您继续使用平台即表示您接受修订后的政策。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-xl">11. 联系我们</h2>
            <p className="text-foreground/90 leading-relaxed">
              如果您对本隐私政策或我们处理数据的方式有疑问，请联系我们：{' '}
              <a
                className="text-foreground underline hover:text-foreground/80"
                href="mailto:support@pascal.app"
              >
                support@pascal.app
              </a>
              .
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
