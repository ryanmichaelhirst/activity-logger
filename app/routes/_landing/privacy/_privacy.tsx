export default function Page() {
  return (
    <main className="mx-auto flex flex-col space-y-6 px-16 pt-6 lg:px-24">
      <h1 className="text-5xl">Privacy Policy</h1>
      <section className="space-y-4">
        <TextBlock title="Last updated: 05/15/2024">
          Remix Railway ("us", "we", or "our") operates https://remixrailway.app (the "Site"). This
          page informs you of our policies regarding the collection, use, and disclosure of Personal
          Information we receive from users of the Site. We use your Personal Information only to
          power your profile page of the Site. By using the Site, you agree to the collection and
          use of information in accordance with this policy.
        </TextBlock>

        <TextBlock title="Information Collection And Use">
          While using our Site, we may ask you to provide us with certain personally identifiable
          information that can be used to contact or identify you. Personally identifiable
          information may include, but is not limited to your name, email address, mailing address,
          and phone number ("Personal Information").
        </TextBlock>

        <TextBlock title="Log Data">
          Like many site operators, we collect information that your browser sends whenever you
          visit our Site ("Log Data"). This Log Data may include information such as your computer's
          Internet Protocol ("IP") address, browser type, browser version, the pages of our Site
          that you visit, the time and date of your visit, the time spent on those pages, and other
          statistics. In addition, we may use third-party services such as Google Analytics that
          collect, monitor, and analyze this data.
        </TextBlock>

        <TextBlock title="Communications">
          We may use your Personal Information to contact you with newsletters, marketing, or
          promotional materials and other information that may be of interest to you. You may
          opt-out of receiving any, or all, of these communications from us by following the
          unsubscribe link or instructions provided in any email we send.
        </TextBlock>

        <TextBlock title="Cookies">
          Cookies are files with a small amount of data, which may include an anonymous unique
          identifier. Cookies are sent to your browser from a web site and stored on your computer's
          hard drive. Like many sites, we use "cookies" to collect information. You can instruct
          your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
          you do not accept cookies, you may not be able to use some portions of our Site.
        </TextBlock>

        <TextBlock title="Security">
          The security of your Personal Information is important to us, but remember that no method
          of transmission over the Internet, or method of electronic storage, is 100% secure. While
          we strive to use commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </TextBlock>

        <TextBlock title="Changes to this Privacy Policy">
          This Privacy Policy is effective as of the date listed above and will remain in effect
          except with respect to any changes in its provisions in the future, which will be in
          effect immediately after being posted on this page. We reserve the right to update or
          change our Privacy Policy at any time, and you should check this Privacy Policy
          periodically. Your continued use of the Service after we post any modifications to the
          Privacy Policy on this page will constitute your acknowledgment of the modifications and
          your consent to abide and be bound by the modified Privacy Policy. If we make any material
          changes to this Privacy Policy, we will notify you either through the email address you
          have provided us, or by placing a prominent notice on our website.
        </TextBlock>

        <TextBlock title="Contact Us">
          If you have any questions about this Privacy Policy, please contact us.
        </TextBlock>
      </section>
    </main>
  )
}

export function TextBlock(props: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-3">
      <p className="text-lg">{props.title}</p>
      <p>{props.children}</p>
    </div>
  )
}
