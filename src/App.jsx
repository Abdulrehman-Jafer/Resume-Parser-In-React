import React, { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    programmingLanguages: "",
  });
  const onFileHandler = (event) => {
    const reabableFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join("");
        text += pageText;
      }

      const nameRegex = /([A-Z][a-z]+)(\s+[A-Z][a-z]+)+/;
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
      const phoneRegex = /\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}/;
      const ageRegex = /(\d{1,2})\s?(years|yrs)?/;
      const programmingLanguagesRegex =
        /\b(?:Java|Python|C(?:\+\+)?|Ruby|JavaScript)\b/gi;

      const getMatchingData = (regex) => {
        return text.match(regex) ? text.match(regex)[0] : "";
      };

      const name = getMatchingData(nameRegex);
      const email = getMatchingData(emailRegex);
      const phone = getMatchingData(phoneRegex);
      const age = getMatchingData(ageRegex);
      const programmingLanguages = text.match(programmingLanguagesRegex)
        ? [...new Set(text.match(programmingLanguagesRegex))].join(",")
        : "";

      setFormData({
        name,
        email,
        phone,
        age,
        programmingLanguages,
      });
    };
    fileReader.readAsArrayBuffer(reabableFile);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="form-main">
      <div className="form-wrapper">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            console.table(formData);
          }}
        >
          <label htmlFor="resume-file">Upload Your Resume:</label>
          <input
            type="file"
            id="resume-file"
            accept=".pdf"
            onChange={(e) => onFileHandler(e)}
            required
          />
          <br />
          <label htmlFor="name-input">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={(e) => {
              onChangeHandler(e);
            }}
          />
          <br />
          <label htmlFor="email-input">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={(e) => onChangeHandler(e)}
          />
          <br />
          <label htmlFor="phone-input">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={(e) => onChangeHandler(e)}
          />
          <br />
          <label htmlFor="age-input">Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={(e) => onChangeHandler(e)}
          />
          <br />
          <label htmlFor="programming-languages-input">
            Programming Language:
          </label>
          <textarea
            type="text"
            name="language"
            rows={5}
            value={formData.programmingLanguages}
            placeholder="Programming Languages"
            onChange={(e) => onChangeHandler(e)}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
};

export default App;
