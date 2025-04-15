import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styles from './accueil.module.css'; // Import CSS Module
import { useNavigate } from "react-router-dom";

const Accueil = () => {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate(); // Permet de gérer la navigation

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/forms');
                if (!response.ok) throw new Error('Erreur lors du chargement des formulaires');
                const data = await response.json();
                setForms(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchForms();
    }, []);

    const handleDeleteForm = async (formId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ? Toutes les réponses associées seront perdues. Cette action est irréversible.")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/forms/${formId}`, { method: "DELETE" });

            if (response.ok) {
                alert("Formulaire et réponses supprimés !");
                setForms(forms.filter((form) => form.id !== formId)); // Mettre à jour la liste localement
            } else {
                const errorData = await response.json();
                alert("Erreur : " + errorData.error);
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible de contacter le serveur.");
        }
    };

    const handleEditForm = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/forms/${formId}/has-responses`);
            const data = await response.json();

            if (data.hasResponses) {
                alert("Ce formulaire contient déjà des réponses et ne peut pas être modifié.");
            } else {
                navigate(`/form-editor2/${formId}`);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification des réponses :", error);
            alert("Erreur lors de la vérification des réponses.");
        }
    };

    return (
        <div>
            <h1>XP-LAB</h1>
            <Link id={styles.createFormLink} to="/form-editor2">Créer un nouveau formulaire</Link>

            <h2>Liste des formulaires enregistrés</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Titre</th>
                        <th className={styles.th}>Date de création</th>
                        <th className={styles.th}>Dernière mise à jour</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.length > 0 ? (
                        forms.map(form => (
                            <tr key={form.id}>
                                <td className={styles.td}>{form.id}</td>
                                <td className={styles.td}>{form.title}</td>
                                <td className={styles.td}>{new Date(form.created_at).toLocaleString()}</td>
                                <td className={styles.td}>{new Date(form.updated_at).toLocaleString()}</td>
                                <td className={styles.td}>
                                    <Link to={`/form-viewer/${form.id}`}>
                                        <button className={`${styles.button} ${styles.viewButton}`}>Voir</button>
                                    </Link>
                                    <button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEditForm(form.id)}>Modifier</button>
                                    <Link to={`/form-responses/${form.id}`}>
                                        <button className={`${styles.button} ${styles.responsesButton}`}>Voir Réponses</button>
                                    </Link>
                                    <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDeleteForm(form.id)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Aucun formulaire trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Accueil;
