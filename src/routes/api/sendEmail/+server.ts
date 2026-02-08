import nodemailer from 'nodemailer';
import { EmailSubjects } from '../../../shared/types.js';
import { env } from '$env/dynamic/private';
import { t } from 'svelte-i18n';


const transporter = nodemailer.createTransport({
    host: "smtp.timeweb.ru", // Zoho SMTP server
    // service: 'Zoho',
    port: 465, // Port for TLS/STARTTLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: env.SECRET_DOMAIN_EMAIL, // Your Zoho email
        pass: env.SECRET_DOMAIN_EMAIL_PASS // Your Zoho password
    },
});


function verifyConnection() {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            //console.log(error);
        } else {
            //console.log("Server is ready to take our messages");
        }
    });

}

// Define your action here
export async function POST({ request }) {
    try {

        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                //console.log(error);
            } else {
                //console.log("Server is ready to take our messages");
            }
        });

        const data = await request.json(); // Parse incoming JSON data
        const { to, subject, text, type } = data;

        // Send the email
        //console.log("in post"+type);
        await sendEmail(to, subject, text, type);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}


const sendEmail = async (to, subject, text, type) => {
    //console.log("in send",type);
    let mailOptions = {
        from: 'nekhaymikita@gmail.com',
        to: to,
        subject: subject,
        text: text+`\n\n\nС уважением и благосклонностью,\nВаш покорный слуга и надёжный помощник в искусстве моды,\nНиколай\nМенеджер по связям с общественностью, дома моды NEKHAY NIKITA \n\nТелеграм: @nikitanekhay\nИнстаграм: @nekhaynikita\nКонтактный номер телефона: +375 44 578-50-57\n\n-------------------------------------------------------\n\nWith utmost respect and benevolence,\nYour humble servant and steadfast aide in the art of fashion,\nNikolay\nPublic Relations Manager, House of NEKHAY NIKITA \n\nTelegram: @nikitanekhay\nInstagram: @nekhaynikita\nContact Phone Number: +375 44 578-50-57`,
   
    };

    switch (type) {
        // чисто для админа
        case EmailSubjects.OrderCredentials: {
            mailOptions.to = "nekhaymikita@gmail.com";
            mailOptions.text = text;
            break;
        }
        case EmailSubjects.NewAccount: {
            break;
        }
        case EmailSubjects.CompleteFullPaymentOrder: {
            break;
        }
        case EmailSubjects.CompletePrePaymentOrder: {
            break;
        }

        default: {
            //console.log("error with type")
            break;
        }

    }
    //console.log('Email data: '+mailOptions.to,mailOptions.from,mailOptions.subject,type);
    try {
        let info = await transporter.sendMail(mailOptions);
       // console.log('Email sent: ' + info.response, mailOptions);
    } catch (error) {
       // console.error('Error sending email: ' + mailOptions.to + "error: " + error);
    }
};
