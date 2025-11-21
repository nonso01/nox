import { useRef } from "react";

export default function Contact({
  // formActionURL = "https://devastatingly-unthrowable-keaton.ngrok-free.dev/contact",
  formActionURL = "http://127.0.0.1:8080/contact",
}) {
  const formEl = useRef(null);
  const formSubmitterEl = useRef(null);

  function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(formEl.current, formSubmitterEl.current);

    const req = new Request(formActionURL, {
      method: "POST",
      body: formData,
    });

    fetch(req)
      .then((res) => {
        if (!res.ok) console.warn("Could not POST  FormData");
        console.log(res.status);
        return res.text();
      })
      .then((data) => console.log(data))
      .catch((error) => console.warn(`An error occured: ${error}`))
      .finally(() => {
        // implement a better success/failure feedback to user
        formEl.current.reset();
      });
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
          encType="multipart/form-data"
          id="nox-form"
          className="flex column evenly"
          ref={formEl}
          onSubmit={handleFormSubmit}
        >
          <div className=" input-text">
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
          <div className=" input-text">
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
          <div className=" input-checkbox">
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
