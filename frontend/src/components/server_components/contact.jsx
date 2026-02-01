import config from "../../configurations/config.json";

export default function Contact() {
    return <div className="contact-wrapper">
        <div className="info">
            <h1>{config.modules.contact_form.customization.heading}</h1>
            <p>{config.modules.contact_form.customization.content}</p>
        </div>
        <div className="inputs">
            <div className="input">
                <span>Email</span>
                <input type="text" name="email" placeholder="Email" />
            </div>
            <div className="input">
                <span>First Name</span>
                <input type="text" name="first_name" placeholder="First Name" />
            </div>
            <div className="input">
                <span>Last Name</span>
                <input type="text" name="last_name" placeholder="Last Name" />
            </div>
            <div className="input">
                <span>message</span>
                <textarea name="message"></textarea>
            </div>
            <button>Send</button>
        </div>
    </div>
}