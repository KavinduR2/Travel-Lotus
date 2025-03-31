import React from 'react';
import { FaCar, FaTaxi, FaBus } from 'react-icons/fa';

const TransportationLinks = ({ title }) => {
    return (
        <div className="transportation-card rounded-lg shadow overflow-hidden">
            <div className="bg-primary text-white p-3">
                <h4 className="m-0 fw-bold">{title}</h4>
            </div>
            <div className="p-4" style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}>
                <div className="d-flex flex-wrap justify-content-around gap-3">
                    <a 
                        href="https://www.uber.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="transportation-btn uber-btn"
                    >
                        <FaCar className="transportation-icon" />
                        <span>Uber</span>
                    </a>
                    <a 
                        href="https://pickme.lk" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="transportation-btn pickme-btn"
                    >
                        <FaTaxi className="transportation-icon" />
                        <span>PickMe</span>
                    </a>
                    <a 
                        href="https://www.sltb.lk" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="transportation-btn bus-btn"
                    >
                        <FaBus className="transportation-icon" />
                        <span>Public Bus</span>
                    </a>
                </div>
            </div>
            <style jsx>{`
                .transportation-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 120px;
                    height: 100px;
                    text-decoration: none;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .transportation-icon {
                    font-size: 28px;
                    margin-bottom: 8px;
                }
                .uber-btn {
                    background: linear-gradient(135deg, #333333 0%, #000000 100%);
                }
                .uber-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 10px rgba(0,0,0,0.2);
                }
                .pickme-btn {
                    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
                }
                .pickme-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 10px rgba(0,0,0,0.2);
                }
                .bus-btn {
                    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
                }
                .bus-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 10px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default TransportationLinks;