import config from "../../../configurations/config.json";

export default function Optout() {
    const handleForm = async (e) => {
        e.preventDefault();

        const backendData = config.modules.backend;

        const formData = new FormData(e.target);

        const email = formData.get("email");

        const host = backendData.host;
        const port = backendData.port;

        const response = await fetch(`${host}:${port}/optout/mail/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })

        const json = await response.json();
        if(json.status) {
            // what to do when the email to opt out of the list is sent
            alert(json.message);
        } else {
            // what to do if the server failed to do it
            alert(json.message);
        }
    }

    if(config.modules.backend.enabled) {
        return <form onSubmit={handleForm}>
            <div className="optout-wrapper">
                <h1>Enter your email below</h1>
                <div className="optout-input">
                    <span>Email</span>
                    <input type="text" placeholder="email" name="email" />
                </div>
                <button>Optout</button>
            </div>
        </form>
    } else {
        return <h1>Sorry but this feature is disabled!</h1>
    }
}