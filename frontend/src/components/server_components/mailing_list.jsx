import config from "../../configurations/config.json";

export default function Mail() {
    const handleForm = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const backendData = config.modules.backend;
        
        const host = backendData.host;
        const port = backendData.port;

        const response = await fetch(`${host}:${port}/add_email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: formData.get("email")
            })
        })

        const json = await response.json();

        if(json.status) {
            // if the email was added
            alert(json.message);
        } else {
            // if the email couldnt be added
            alert(json.message)
        }
    }

    return <form onSubmit={handleForm}>
        <div className="mail-wrapper">
            <h1>Join the Mailing List!</h1>
            <input type="text" placeholder="Email" name="email" />
            <button>Join Today!</button>
        </div>
    </form>
}