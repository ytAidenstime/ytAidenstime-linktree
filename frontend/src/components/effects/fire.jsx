import { useEffect, useMemo, useState } from "react";

import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim";

export default function Fire() {
    const [ init, setInit ] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        })
    }, [])

const particlesLoaded = () => {

}

const options = useMemo(
    () => ({
        particles: {
            color: {
                value: "#f74b21"
            },
            number: {
                value: 100
            },
            opacity: {
                value: 1
            },
            shape: {
                type: "circle"
            },
            size: {
                value: { min: 1, max: 5 }
            },
            move: {
                direction: "top",
                enable: true
            }
        }
    })
)

  if(init) {
    return <Particles 
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
        />
  }
}