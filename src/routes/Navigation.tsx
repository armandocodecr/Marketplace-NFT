import { Suspense, useContext } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';

import { routes } from './routes';
import { useAccount } from 'wagmi';
import { truncateText } from '../lib/utils';
import { ContractsContext } from '../context/Contracts';

export const Navigation = () => {
    const { address } = useAccount();
    const { loadWeb3 } = useContext(ContractsContext)

    return (
        <Suspense>
            <BrowserRouter>
                <div className="flex flex-col">
                    <nav className='w-full px-64 font-medium text-xl text-white fixed border-b border-[rgba(102,102,102,0.49)] flex justify-between items-center h-16 py-3 px-10'>
                        <ul className='flex justify-center items-center gap-5'>
                            {
                                routes.map(({ to, name }) => (
                                   <>
                                     <li key={ to }>
                                         <NavLink 
                                            to={ to } 
                                            className={ ({ isActive }) => isActive ? 'nav-active' : '' }>
                                                { name }
                                        </NavLink>
                                     </li>
                                   </>
                                ))
                            }
                        </ul>
                        {
                            address ? (
                                <p className='py-1 px-4 rounded-lg border border-[rgba(102,102,102,0.49)]'>{truncateText(address?.toString() || "", 8)}</p>
                            )
                            : (
                                <button 
                                    className='py-1 flex justify-center items-center px-4 rounded-lg border border-[rgba(102,102,102,0.49)]'
                                    onClick={loadWeb3}
                                >
                                    Connect Wallet
                                </button>
                            )
                        }
                    </nav>
            
            
                    <Routes>
                        {
                            routes.map(({ path, Component }) => (
                                    <Route path={path} element={ < Component /> } key={ path }/>
                            ))
                        }
                        
                        <Route path="/*" element={ <Navigate to={ routes[0].to } replace /> } />
                    </Routes>
            
                </div>
            </BrowserRouter>
        </Suspense>
    )
}