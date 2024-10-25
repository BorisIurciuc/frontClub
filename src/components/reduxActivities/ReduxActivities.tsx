// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../app/store';
// import { addActivity, getActivities } from './reduxActivitiesAction';
// import { cleanActivities } from './reduxActivitiesSlice';

// const ReduxActivities: React.FC = () => {
//   const dispatch = useDispatch();
//   const { activities, isLoading, error } = useSelector((state: RootState) => state.reduxActivities); 

//   const [title, setTitle] = useState('');
//   const [address, setAddress] = useState('');
//   const [dateTime, setDateTime] = useState<string>('');
//   const [image, setImage] = useState<File | null>(null);
//   const [description, setDescription] = useState('');

//   useEffect(() => {
//     dispatch(getActivities());

//     return () => {
//       dispatch(cleanActivities());
//     };
//   }, [dispatch]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!image) return;

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('address', address);
//     formData.append('dateTime', dateTime);
//     formData.append('file', image);
//     formData.append('description', description);

//     await dispatch(addActivity(formData));
    
//     setTitle('');
//     setAddress('');
//     setDateTime('');
//     setImage(null);
//     setDescription('');
//   };

//   return (
//     <div>
//       <h1>Активности</h1>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {isLoading ? (
//         <p>Загрузка...</p>
//       ) : (
//         <ul>
//           {activities.map((activity) => (
//             <li key={activity.id}>
//               <h2>{activity.title}</h2>
//               <p>{activity.address}</p>
//               <p>{new Date(activity.dateTime).toLocaleString()}</p>
//               {activity.image && (
//                 <img src={activity.image} alt={activity.title} style={{ width: '100px', height: '100px' }} />
//               )}
//               <p>{activity.description}</p>
//             </li>
//           ))}
//         </ul>
//       )}

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Название активности"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Адрес"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//         <input
//           type="datetime-local"
//           value={dateTime}
//           onChange={(e) => setDateTime(e.target.value)}
//           required
//         />
//         <input
//           type="file"
//           onChange={(e) => {
//             if (e.target.files && e.target.files[0]) {
//               setImage(e.target.files[0]);
//             }
//           }}
//           required
//         />
//         <textarea
//           placeholder="Описание"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <button type="submit">Добавить активность</button>
//       </form>
//     </div>
//   );
// };

// export default ReduxActivities;
