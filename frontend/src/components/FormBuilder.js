import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const navigate = useNavigate();

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  const generateLink = () => {
    if (formTitle.trim() && questions.length > 0) {
      const formId = Math.random().toString(36).substr(2, 9); // Génère un ID unique
      const formURL = `http://localhost:3000/form/${formId}`;

      // Stocker les données dans le localStorage
      const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
      storedForms.push({
        id: formId,
        title: formTitle,
        questions: questions,
        url: formURL,
      });
      localStorage.setItem("forms", JSON.stringify(storedForms));

      navigate(`/form/${formId}`);
    } else {
      alert("Veuillez ajouter un titre et au moins une question !");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Créer un formulaire</h1>
      <div>
        <label>Titre du formulaire :</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Ajouter une question :</label>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={addQuestion}>Ajouter</button>
      </div>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>{q}</li>
        ))}
      </ul>
      <button onClick={generateLink}>Générer le lien</button>
    </div>
  );
};

export default FormBuilder;
