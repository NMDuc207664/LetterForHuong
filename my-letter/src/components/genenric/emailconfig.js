export const emailConfig = {
  from: 'Huong\'s Letter <onboarding@resend.dev>',

  to: process.env.REPLY_EMAIL,

  subject: 'Có người đã hồi đáp bức thư của bạn 💌',
}


export const createEmailHtml = (content) => {
  return `
    <div
      style="
        font-family: Georgia, 'Times New Roman', serif;
        line-height: 1.8;
        color: #302d2b;
        max-width: 700px;
        margin: auto;
      "
    >

      <h2
        style="
          color: #49376a;
          font-weight: normal;
        "
      >
        Có người đã hồi đáp 💌
      </h2>

      <hr
        style="
          border: none;
          border-top: 1px solid #ddd6cd;
        "
      />

      <div>
        ${content}
      </div>

      <hr
        style="
          border: none;
          border-top: 1px solid #ddd6cd;
          margin-top: 30px;
        "
      />

      <p
        style="
          color: #888;
          font-size: 13px;
          font-style: italic;
        "
      >
        Reply được gửi từ website tâm thư.
      </p>

    </div>
  `
}