import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '服务条款',
  description: '捷租建造编辑器和捷租建造平台的服务条款',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-border border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/"
            >
              首页
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-foreground">服务条款</span>
            <span className="text-muted-foreground">|</span>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href="/privacy"
            >
              隐私政策
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="mb-2 font-bold text-3xl">服务条款</h1>
          <p className="mb-8 text-muted-foreground text-sm">生效日期：2026年2月20日</p>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">1. 简介</h2>
            <p className="text-foreground/90 leading-relaxed">
              欢迎使用捷租建造编辑器（以下简称"编辑器"）和捷租建造平台（以下简称"平台"）。通过访问或使用我们的服务，您同意遵守本服务条款。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">2. 编辑器与平台</h2>
            <p className="text-foreground/90 leading-relaxed">
              捷租建造编辑器是基于 MIT 协议发布的开源软件。您可以根据 MIT 协议的条款使用、复制、修改、合并、发布、分发、再授权和/或出售编辑器软件的副本。
            </p>
            <p className="text-foreground/90 leading-relaxed">
              捷租建造平台及其相关服务（包括用户账户、云存储和项目托管）为专有服务，归捷租建造所有和运营。本条款规范您对平台的使用。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">3. 账户与认证</h2>
            <p className="text-foreground/90 leading-relaxed">
              要使用平台的某些功能，您需要创建账户。您需使用手机号码和密码进行注册和登录。您有责任维护账户凭据的安全，并对账户下发生的所有活动承担责任。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">4. 可接受的使用</h2>
            <p className="text-foreground/90 leading-relaxed">您同意不：</p>
            <ul className="list-disc space-y-2 pl-6 text-foreground/90">
              <li>将平台用于任何违法目的或违反适用法律法规的行为</li>
              <li>上传、分享或传播侵犯知识产权的内容</li>
              <li>尝试未经授权访问平台或其系统</li>
              <li>干扰或破坏平台的基础设施</li>
              <li>上传恶意代码、病毒或有害内容</li>
              <li>骚扰、辱骂或伤害其他用户</li>
              <li>利用平台发送垃圾信息或未经请求的通讯</li>
            </ul>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">5. 您的内容与知识产权</h2>
            <p className="text-foreground/90 leading-relaxed">
              您对在平台上创建或上传的所有内容、项目和数据（以下简称"您的内容"）保留完整所有权。通过使用平台，您授予我们有限的许可，以便仅为向您提供服务而存储、展示和传输您的内容。
            </p>
            <p className="text-foreground/90 leading-relaxed">
              我们不主张对您的内容享有任何所有权。您可以随时导出或删除您的内容。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">6. 平台所有权</h2>
            <p className="text-foreground/90 leading-relaxed">
              平台（包括其设计、功能和专有代码）归捷租建造所有，受知识产权法律保护。虽然编辑器源代码基于 MIT 协议开源，但平台服务、品牌和基础设施仍为我们的专有财产。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">7. 账户终止</h2>
            <p className="text-foreground/90 leading-relaxed">
              如果您违反本条款或从事我们认为对平台或其他用户有害的行为，我们保留暂停或终止您账户的权利。您也可以随时通过联系{' '}
              <a
                className="text-foreground underline hover:text-foreground/80"
                href="mailto:support@jiezujianzo.com"
              >
                support@jiezujianzo.com
              </a>
              {' '}来删除您的账户。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">8. 免责声明</h2>
            <p className="text-foreground/90 leading-relaxed">
              平台按"现状"和"可用状态"提供，不附带任何形式的明示或暗示保证，包括但不限于对适销性、特定用途适用性和不侵权的暗示保证。
            </p>
            <p className="text-foreground/90 leading-relaxed">
              我们不保证平台将不间断运行、无错误或不含有害组件。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">9. 责任限制</h2>
            <p className="text-foreground/90 leading-relaxed">
              在法律允许的最大范围内，捷租建造对因您使用平台而产生的任何间接、附带、特殊、后果性或惩罚性损害（包括数据、利润或商誉的损失）不承担责任。
            </p>
          </section>

          <section className="mb-8 space-y-4">
            <h2 className="font-semibold text-xl">10. 条款变更</h2>
            <p className="text-foreground/90 leading-relaxed">
              我们可能会不时更新本条款。我们将通过在平台上发布更新后的条款来通知您重大变更。变更发布后，您继续使用平台即表示您接受修订后的条款。
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-xl">11. 联系我们</h2>
            <p className="text-foreground/90 leading-relaxed">
              如果您对本条款有任何疑问，请联系我们：{' '}
              <a
                className="text-foreground underline hover:text-foreground/80"
                href="mailto:support@jiezujianzo.com"
              >
                support@jiezujianzo.com
              </a>
              。
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
