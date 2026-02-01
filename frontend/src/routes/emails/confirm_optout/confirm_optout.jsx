import { useParams } from "react-router-dom";

import config from "../../../configurations/config.json";


export default function ConfirmOptout() {
    const { email } = useParams();

    const handleForm = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const backendData = config.modules.backend;

        const host = backendData.host;
        const port = backendData.port;

        const response = await fetch(`${host}:${port}/optout/mail/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                code: formData.get("code")
            })
        });

        const json = await response.json();

        if(json.status) {
            // if the removal was a success
            alert(json.message);
        } else {
            // if the removal was not a success
            alert(json.message);
        }
    }

    if(config.modules.backend.enabled) {
        return <form onSubmit={handleForm}>
            <div className="optout-wrapper">
                <h1>Confirm Optout</h1>
                <div className="optout-input">
                    <span>Code</span>
                    <input type="text" placeholder="Code" name="code" />
                </div>
                <button>Confirm</button>
            </div>
        </form>
    } else {
        return <h1>Sorry but this feature is disabled!</h1>
    }
}