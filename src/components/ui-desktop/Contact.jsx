// import { useEffect, useState } from "react";

//Which server should i use Rust or Nodejs ? i enjoy both :D
// initialize a dummy get request to your server to wake it up
// currently on a free instance

export default function Contact({
  // formActionURL = "https://nox-hltl.onrender.com",
  formActionURL = "http://127.0.0.1:8080",
}) {
  // const [status, setStatus] = useState(false); // your cloud server

  // const getCloudServerStatus = useEffect(() => {
  //   let f = fetch("https://nox-hltl.onrender.com")
  //     .then((res) => console.log(res.status))
  //     .catch((error) => console.warn(error));
  // }, []);

  function handleInputName({ target }) {
    const maxNameLength = target?.maxLength ?? 40;
    let remaining = maxNameLength - target?.value.length;

    console.log(r);
  }
  function handleInputEmail() {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //  emailRegex.test(email);
  }
  function handleInputMessage() {}

  function handleFormSubmit() {}

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
              maxLength={40}
              minLength={2}
              onInput={handleInputName}
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
              maxLength={80}
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
              maxLength={2000}
            ></textarea>
          </div>
          <div className=" input-checkbox ">
            <fieldset form="nox-form" className="flex column evenly">
              <legend>How can i help</legend>

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
            <button title="submit" type="submit">
              Let's Go!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
