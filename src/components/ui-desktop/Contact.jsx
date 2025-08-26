//Which server should i use Rust or Nodejs ? 
// i enjoy both :D

export default function Contact({
  formActionURL = "http://localhost:3000/nox-form",
  // formActionURL = "http://127.0.0.1:7878",
}) {
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
          enctype="application/x-www-form-urlencoded"
          id="nox-form"
          className="flex column evenly "
        >
          <div className=" input-text ">
            <label htmlFor="noxName"></label>
            <input
              type="text"
              name="noxName"
              id="noxName"
              placeholder="your name"
              required
              autoComplete="on"
            />
          </div>
          <div className=" input-text ">
            <label htmlFor="noxEmail"></label>
            <input
              type="email"
              name="noxEmail"
              id="noxEmail"
              placeholder="your@email.todo"
              required
              autoComplete="on"
            />
          </div>
          <div className=" input-area ">
            <label htmlFor="noxMessage"></label>
            <textarea
              name="noxMessage"
              id="noxMessage"
              placeholder="what would you like me to do for you ?"
              autoCorrect="on"
              spellCheck="true"
              cols={30}
              wrap="hard"
              required
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
            <button type="submit">Let's Go!</button>
          </div>
        </form>
      </div>
    </div>
  );
}
