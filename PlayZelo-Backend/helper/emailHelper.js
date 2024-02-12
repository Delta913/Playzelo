const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendMsg = async (to, subject, html) => {
    try {
        const msg = {
            to: to,
            from: 'no-reply@playzelo.com',
            subject: subject,
            html: html
        };
        const response = await sgMail.send(msg);
        console.log('Email Successfully Sent!');
        return { status: true };
    }
    catch (err) {
        console.error({ title: 'emailHelper => sendMsg', message: err.message });
        return { status: false };
    }
};

exports.authenticationEmail = (code) => {
    return `<b>${code}</b>`;
}