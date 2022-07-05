import * as React from 'react';
import { Link } from 'react-router-dom';
import Log from '../components/log/Log';


function Home() {
    return (
        <>
            <main>
                <header>
                    <img src="./img/icon-left-font.png" alt="logo de Groupomania" />
                </header>
                <div>
                    <div>
                        <Log signin={false} signup={true} />
                        <img src="./img/login.svg" alt="login" />
                    </div>
                </div>
            </main>
            <nav>
                <Link to="/post">Post</Link>
            </nav>
        </>
    );
}

export default Home;