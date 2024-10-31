
import styles from "./projectCreators.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

interface IParticipant {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  photo: string; 
  linkedin: string;
  github: string;
  cv: string;
}

const ProjectCreators: React.FC = () => {

  const participants: IParticipant[] = [
    {
      id: 1,
      firstName: "Vasile",
      lastName: "Versina",
      specialization: "FrontEnd",
      photo: "https://my-activity-images.s3.eu-north-1.amazonaws.com/vasile.jpg", 
      linkedin: "https://www.linkedin.com/in/vasile-versina-706a1b333",
      github: "https://github.com/VersinaV",
      cv: ""
    },
    {
      id: 2,
      firstName: "Maryna",
      lastName: "Matsveyenka",
      specialization: "FrontEnd",
      photo: "https://my-activity-images.s3.eu-north-1.amazonaws.com/marina.jpg", 
      linkedin: "https://www.linkedin.com/in/maryna-matsveyenka",
      github: "https://github.com/Matsveyenka1994",
      cv: "https://drive.google.com/file/d/1QISFb1OGiV21diOfjZYQIhZVneiYJ6jr/view?usp=sharing"
    },
    {
      id: 3,
      firstName: "Denis",
      lastName: "Nejelschi",
      specialization: "Full Stack",
      photo: "https://my-activity-images.s3.eu-north-1.amazonaws.com/denis.jpeg", 
      linkedin: "https://www.linkedin.com/in/denis-nejelschi-3b484337",
      github: "https://github.com/denisNejelschi",
      cv: "https://docs.google.com/document/d/1Rim_94tC2bPQ9oorKx8IPOAmtpw9B8pwcOgLBCIiN4c/edit?usp=sharing"
    },
    {
      id: 4,
      firstName: "Boris",
      lastName: "Iurciuc",
      specialization: "Full Stack",
      photo: "https://my-activity-images.s3.eu-north-1.amazonaws.com/Boris+Iurciuc.jpg", 
      linkedin: "https://www.linkedin.com/in/boris-iurciuc-44000259",
      github: "https://github.com/BorisIurciuc",
      cv: ""
    },
    {
      id: 5,
      firstName: "Vitalii",
      lastName: "Kovtun",
      specialization: "FrontEnd",
      photo: "https://my-activity-images.s3.eu-north-1.amazonaws.com/vitali.jpg", 
      linkedin: "https://www.linkedin.com",
      github: "https://github.com/Vitalii-Kov",
      cv: ""
    },
    {
      id: 6,
      firstName: "Dimitri",
      lastName: "Heinrich",
      specialization: "BackEnd",
      photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Xnp5sqAeZx9FlQUlmKKQwXFj977Cx-9TIw&s", 
      linkedin: "https://www.linkedin.com/in/dimitri-heinrich-813789333",
      github: "https://github.com/DmitriH-ich",
      cv: ""
    },
  ];

  return (
    <div className={styles.participantsContainer}>
      <div className={styles.headerContainer}> 
        <h2>Project Creators</h2>
      </div>
      <div className={styles.participantList}>
        {participants.map((participant) => (
          <div key={participant.id} className={styles.participantCard}>
            <img
              src={participant.photo}
              alt={`${participant.firstName} ${participant.lastName}`}
              className={styles.participantPhoto}
            />
            <h3>{`${participant.firstName} ${participant.lastName}`}</h3>
            <strong>Specialization: {participant.specialization}</strong>
            
            <div className={styles.socialLinks}>
  {participant.linkedin && (
    <a 
      href={participant.linkedin} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${styles.iconLink} ${styles.linkedin}`}
    >
      <FontAwesomeIcon icon={faLinkedin} /> 
    </a>
  )}
  {participant.github && (
    <a 
      href={participant.github} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${styles.iconLink} ${styles.github}`}
    >
      <FontAwesomeIcon icon={faGithub} /> 
    </a>
  )}
  {participant.cv && (
    <a 
      href={participant.cv} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`${styles.iconLink} ${styles.cv}`}
    >
      <FontAwesomeIcon icon={faFileAlt} /> 
    </a>
  )}
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCreators;
