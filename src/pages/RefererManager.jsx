import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaGlobe } from 'react-icons/fa';
import config from '../config';

const Container = styled.div`
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify_content: space-between;
  align_items: center;
  margin_bottom: 30px;
`;

const Title = styled.h2`
  margin: 0;
  font_size: 24px;
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  padding: 10px 20px;
  border_radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align_items: center;
  gap: 8px;
  font_weight: bold;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border_radius: 12px;
  padding: 20px;
  margin_bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify_content: space-between;
  align_items: center;
`;

const Info = styled.div`
  display: flex;
  flex_direction: column;
  gap: 5px;
`;

const SiteName = styled.span`
  font_size: 18px;
  font_weight: bold;
  display: flex;
  align_items: center;
  gap: 8px;
`;

const SiteUrl = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font_size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 8px;
  border_radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.danger ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
    color: ${props => props.danger ? '#ff3b30' : 'white'};
  }
`;

const InputGroup = styled.div`
  margin_bottom: 15px;
  display: flex;
  flex_direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font_size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  border_radius: 8px;
  color: white;
  font_size: 16px;
  
  &:focus {
    outline: none;
    border_color: #2575fc;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align_items: center;
  gap: 10px;
  margin_bottom: 20px;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify_content: center;
  align_items: center;
  z_index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 30px;
  border_radius: 16px;
  width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RefererManager = () => {
    const [referers, setReferers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        site_name: '',
        url: '',
        is_global: false
    });

    useEffect(() => {
        fetchReferers();
    }, []);

    const fetchReferers = async () => {
        try {
            const response = await fetch(`${config.API_URL}/referers`);
            const data = await response.json();
            setReferers(data);
        } catch (error) {
            console.error('Error fetching referers:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this referer?')) {
            try {
                await fetch(`${config.API_URL}/referers/${id}`, {
                    method: 'DELETE',
                });
                fetchReferers();
            } catch (error) {
                console.error('Error deleting referer:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${config.API_URL}/referers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            setIsModalOpen(false);
            setFormData({ site_name: '', url: '', is_global: false });
            fetchReferers();
        } catch (error) {
            console.error('Error adding referer:', error);
        }
    };

    return (
        <Container>
            <Header>
                <Title>Referer Management</Title>
                <AddButton onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> Add New
                </AddButton>
            </Header>

            {referers.map((referer) => (
                <Card key={referer.id}>
                    <Info>
                        <SiteName>
                            {referer.site_name}
                            {referer.is_global && <FaGlobe title="Global Default" color="#2575fc" size={14} />}
                        </SiteName>
                        <SiteUrl>{referer.url}</SiteUrl>
                    </Info>
                    <Actions>
                        <ActionButton danger onClick={() => handleDelete(referer.id)}>
                            <FaTrash />
                        </ActionButton>
                    </Actions>
                </Card>
            ))}

            {isModalOpen && (
                <Modal onClick={() => setIsModalOpen(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, marginBottom: 20 }}>Add New Referer</h3>
                        <form onSubmit={handleSubmit}>
                            <InputGroup>
                                <Label>Site Name</Label>
                                <Input
                                    required
                                    value={formData.site_name}
                                    onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                                    placeholder="e.g. Dizipal"
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>Referer URL</Label>
                                <Input
                                    required
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="e.g. https://dizipal1539.com/"
                                />
                            </InputGroup>
                            <CheckboxContainer onClick={() => setFormData({ ...formData, is_global: !formData.is_global })}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_global}
                                    onChange={() => { }}
                                    style={{ width: 18, height: 18 }}
                                />
                                <span>Set as Global Default</span>
                            </CheckboxContainer>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex_end' }}>
                                <AddButton type="button" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </AddButton>
                                <AddButton type="submit">
                                    Save
                                </AddButton>
                            </div>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default RefererManager;
