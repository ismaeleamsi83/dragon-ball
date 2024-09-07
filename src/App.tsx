
import { useEffect, useState } from 'react';
import './App.css'
import logo from './assets/logo-dragon-ball.png';
import { cardInterface } from './interfaces/cardInterface';
import { pageInterface } from './interfaces/pageInterface';
import React from 'react';
import { CharacterInterface } from './interfaces/characterInterface';
import backgroundFirst  from './assets/back-dragon-ball.jpg'
import backgroundCard  from './assets/back-card.jpeg'

function App() {

  

  const [card, setCard] = useState<cardInterface[]>([]);
  const [page, setPage] = useState<pageInterface>();
  const [type, setType] = useState<string>('characters');
  const [character, setCharacter] = useState<CharacterInterface>(
    {
      id: 0,
      name: "",
      ki: "",
      maxKi: "",
      race: "",
      gender: "",
      description: "",
      image: "",
      affiliation: "",
      deletedAt: null,
      originPlanet: {
          id: 0,
          name: "",
          isDestroyed: false,
          description: "",
          image: "",
          deletedAt: null
      },
      transformations: []
  }
  );

  // dialog
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // const apiDragonBall = `https://dragonball-api.com/api/characters?page=1`;
  const apiDragonBall = `https://dragonball-api.com/api/`;

  useEffect(()=>{
    animeHeader();
  })

  useEffect(()=>{
    fetchCharacters('characters');
  },[])
  
  const animeHeader = () => {
    const headerEl = document.querySelector('#header-anime');
    window.addEventListener('scroll',  () =>{
      if( window.scrollY > 0 ){
        headerEl?.classList.add('active');
      }else{
        headerEl?.classList.remove('active');
      }
    });
  }

  const fetchCharacters = async (typeConsult:string) => {
    if(typeConsult){
      setType(typeConsult);
    }
    try{
      const response = await fetch(`${apiDragonBall}${typeConsult}?page=1`);
      const data = await response.json();
      setCard(data.items);
      setPage(data.meta);
      // console.log(data.items);
      // console.log(data.meta);
    }catch(err){  
      console.error(err);
    }
  }

  const nextPage = async () => {
    if(!(page?.currentPage == page?.totalPages) && (page?.currentPage)){
      try{
        const apiDragon = await fetch(`${apiDragonBall}${type}?page=${page?.currentPage+1}`);
        const data = await apiDragon.json();
        setCard(data.items);
        setPage(data.meta);
        // console.log(data.items);
        // console.log(data.meta);
      }catch(err){  
        console.error(err);
      }
    }else{
      // alert('No hay más páginas');
    }
  }

  const lessPage = async () => {
    if(!(page?.currentPage == 1) && (page?.currentPage)){
      try{
        const apiDragon = await fetch(`${apiDragonBall}${type}?page=${page?.currentPage-1}`);
        const data = await apiDragon.json();
        setCard(data.items);
        setPage(data.meta);
        // console.log(data.items);
        // console.log(data.meta);
      }catch(err){  
        console.error(err);
      }
    }else{
      // alert('Es la primera página');
    }
  }

  

  const openDialog = (idCharacter: cardInterface) => {
    dialogRef.current?.show();
    detailCharacters(idCharacter);
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };


  const detailCharacters = async (idCharacter: cardInterface) => {
    // console.log(idCharacter);
    try{
      const response = await fetch(`${apiDragonBall}${type}/${idCharacter.id}`);
      const data = await response.json();
      setCharacter(data);
      // console.log(data);
    }catch(err){  
      console.error(err);
    }
  }

  return (
    <>
    
      <header id='header-anime'>
        <nav>
          <div>
            <img src={logo} alt="" />
          </div>
          <ul>
            <li><a onClick={()=>fetchCharacters('characters')}>Personajes</a></li>
            <li><a onClick={()=>fetchCharacters('planets')}>Planetas</a></li>
          </ul>
        </nav>
      </header>
      <section id='back-first' style={{ backgroundImage: `url(${backgroundFirst})` }}>
      </section>
      {type == 'characters'?
      
      <section id='content-body'>
        {card.map(item =>(
          <div key={item.id} className='card-character' style={{ backgroundImage: `url(${backgroundCard})` }}>
            <img src={logo} alt="" className='logo-card' />
            <div className='content-image'>
              <img src={item.image} alt="" className='image-card' />
            </div>
            <div className='content-text'>
              <h4>{item.name}</h4>
              
              <p>Ki Base: {item.ki}</p>
              <p>Ki Máximo: {item.maxKi}</p>
              
              <button className="learn-more" onClick={()=>openDialog(item)}>
                <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
                </span>
                <span className="button-text">Ver más</span>
              </button>
            </div>
          </div>
        ))}
      </section>
      :
      <section id='content-body'>
        {card.map(item =>(
          <div key={item.id} className='card-character' id='card-planet' >
            <img src={logo} alt="" className='logo-card' />
            <div className='content-image'>
              <img src={item.image} alt="" className='image-card' />
            </div>
            <div className='content-text' id='text-planets'>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </section>
      }
      <section id='pagination'>
          <button onClick={lessPage} className="btn">Atras</button>
          <span>Página actual:{page?.currentPage}</span>
          <button onClick={nextPage} className="btn">Siguiente</button>
      </section>

      <dialog ref={dialogRef} data-info="important" id='dialog'>
        <div id="dialog-content">
          {(character)?
            <>
              <h2>{character.name}</h2>
              <div className="affiliation">Afiliación: {character.affiliation}</div>
              <div className="race">Tipo: {character.race}</div>
              <div className="gender">Genero: {character.gender}</div>
              <div className="ki-info">Base Ki: {character.ki}</div>
              <div className="ki-info">Máximo Ki: {character.maxKi}</div>
              <p className="description">{character.description}</p>
              
              <div className="planet">
                <h3>Planeta de Origen: {character.originPlanet.name}</h3>
                <div >
                  <img src={character.originPlanet.image}  />
                  <p>{character.originPlanet.description}</p>
                </div>
              </div>


              {character.transformations.length > 0 && (
              <div className="transformations">
                <h3>Transformaciones</h3>
                    <div className="transformation-list">
                      {character.transformations.map(transform =>(
                        <div className="transformation" key={transform.id} >
                          <div style={{ backgroundImage: `url(${backgroundCard})` }}>
                            <img src={transform.image}  />
                          </div>
                          <h3>{transform.name}</h3>
                          <p>Ki: {transform.ki}</p>
                        </div>
                      ))}
                    </div>
              </div>
              )}
            </>
          :
            <div>No funciona</div>
          }       
                
        <button onClick={closeDialog} className='btn'>Cerrar Diálogo</button>
        </div>
      </dialog>
    
    </>
  )
}

export default App
