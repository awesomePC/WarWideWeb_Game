import React, { useState } from "react";
import '../../../styles/fundModal.css'
import Modal from 'react-modal'
import toast from 'react-hot-toast';
import { deposit } from "../../../api/UserApi";
import { useDispatch } from 'react-redux';
import { getBalance } from '../../../api/balanceApi';

Modal.setAppElement("#root");
const AddFund = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [amount, setAmount] = useState(0);

    const handleChange = (e) => {
        const { value } = e.target;
        setAmount(value);
    }

    const handleSubmit = async () => {
        if (amount > 0) {
            await toast.promise(deposit(amount), {
                loading: 'waiting...',
                success: <b>Deposit Ended</b>,
                error: <b>Deposit Failed</b>,
            })
            getBalance(dispatch);
        } else {
            toast.error('Fill the Amount field.')
        }

    }
    return (
        <>
            <div className='changeroom' onClick={() => setIsOpen(true)}>Add Fund</div>
            <div className="fund-modal">
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setIsOpen(false)}
                    overlayClassName={{
                        base: "overlay-base",
                        afterOpen: "overlay-after",
                        beforeClose: "overlay-before"
                    }}
                    className={{
                        base: "content-base",
                        afterOpen: "content-after",
                        beforeClose: "content-before"
                    }}
                    closeTimeoutMS={500}
                >
                    <div className='fund-header'>
                        <h2>Deposit Ethereum</h2>
                    </div>
                    <div className="fund-body">
                        <input className="fund-input" placeholder="Amount in Ether" onChange={handleChange} required />
                        <div className="fund-button-group">
                            <div className='fund-deposit' onClick={handleSubmit}>Deposit</div>
                            <div className='close-modal' onClick={() => setIsOpen(false)}>Close</div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default AddFund