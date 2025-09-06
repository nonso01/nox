// import { useEffect, useState } from "react";

import { useRef } from "react";

// use express for dev and rust for prod

// initialize a dummy get request to your server to wake it up
// currently on a free instance

// form can be edited using dev-tools make sure to handle that on the server

export default function Contact({
  // formActionURL = "https://nox-hltl.onrender.com",
  // formActionURL = "http://127.0.0.1:3000/nox-form",
  formActionURL = "http://127.0.0.1:8080",
}) {
  const formEl = useRef(null);
  const formSubmitterEl = useRef(null);
  // const [status, setStatus] = useState(false); // your cloud server

  // const getCloudServerStatus = useEffect(() => {
  //   let f = fetch("https://nox-hltl.onrender.com")
  //     .then((res) => console.log(res.status))
  //     .catch((error) => console.warn(error));
  // }, []);

  /* My Sever handles most of the validations and security checks */

  function checkLenght(e) {
    const max = 1900;
    let r = max - e.target.value.length;
    console.log(r);
  }

  function handleFormSubmit(e) {
    // e.preventDefault();
    const formData = new FormData(formEl.current, formSubmitterEl.current);
    // formData.set("email", 300); // causes an error in rust server

    // convert formData to urlencoded for express
    const params = new URLSearchParams();
    for (const [key, value] of formData) {
      params.append(key, value);
    }
    console.log(params.toString());

    const req = new Request(formActionURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: params,
    });

    fetch(req)
      .then((res) => {
        if (!res.ok) console.error("Could not POST  FormData");
        return res.text();
      })
      .then((data) => console.log(data))
      .catch((error) => console.warn(`an error occured: ${error}`));
  }

  return (
    <div className="contact flex column between ">
      <div className="contact-title flex column evenly ">
        <h2>Got ideas ? I've got the skills. Let's make it happen</h2>
        <p>Tell me more about yourself and what you got in mind</p>
      </div>
      <div className="contact-form ">
        <form
          method="POST"
          action={formActionURL}
          id="nox-form"
          className="flex column evenly "
          ref={formEl}
          onSubmit={handleFormSubmit}
        >
          <div className=" input-text ">
            <label htmlFor="noxName"></label>
            <input
              type="text"
              name="name"
              id="noxName"
              placeholder="your name"
              required
              autoComplete="on"
              maxLength={100}
              minLength={2}
            />
          </div>
          <div className=" input-text ">
            <label htmlFor="noxEmail"></label>
            <input
              type="email"
              name="email"
              id="noxEmail"
              placeholder="your@email.todo"
              required
              autoComplete="on"
              maxLength={250}
            />
          </div>
          <div className=" input-area ">
            <label htmlFor="noxMessage"></label>
            <textarea
              name="message"
              id="noxMessage"
              placeholder="what would you like me to do for you ?"
              autoCorrect="on"
              spellCheck="true"
              cols={30}
              wrap="hard"
              required
              minLength={2}
              maxLength={1900}
              // onInput={checkLenght}
            ></textarea>
          </div>
          <div className=" input-checkbox ">
            <fieldset form="nox-form" className="flex column evenly">
              <legend>How can i help</legend>
              {/* no values should be set on the checkbox "check=on" is ok, if you decide otherwise then uodate your post handler */}
              <label htmlFor="webDevelopment">
                <input
                  type="checkbox"
                  name="webDevelopment"
                  id="webDevelopment"
                />
                <span>Website Development</span>
              </label>
              <label htmlFor="frontend">
                <input type="checkbox" name="frontend" id="frontend" />
                <span>Frontend Task</span>
              </label>
              <label htmlFor="blender">
                <input type="checkbox" name="blender" id="blender" />
                <span>Blender Model</span>
              </label>
            </fieldset>
          </div>
          <div className="input-button flex center ">
            <button title="submit" type="submit" ref={formSubmitterEl}>
              Let's Go!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
