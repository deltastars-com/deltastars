import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PlusCircle, Edit, Trash2, MapPin, Users } from 'lucide-react';

interface Branch {
  id: string;
  name_ar: string;
  name_en: string;
  city: string;
  phone: string;
  is_active: boolean;
  location: { lat: number; lng: number };
}

export const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    city: '',
    phone: '',
    lat: 21.5424,
    lng: 39.2201
  });

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    const { data } = await supabase.from('branches').select('*').order('created_at');
    if (data) setBranches(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      await supabase
        .from('branches')
        .update({
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          city: formData.city,
          phone: formData.phone,
          location: { lat: formData.lat, lng: formData.lng }
        })
        .eq('id', editingBranch.id);
    } else {
      await supabase.from('branches').insert({
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        city: formData.city,
        phone: formData.phone,
        location: { lat: formData.lat, lng: formData.lng },
        is_active: true
      });
    }
    loadBranches();
    setShowForm(false);
    setEditingBranch(null);
    setFormData({ name_ar: '', name_en: '', city: '', phone: '', lat: 21.5424, lng: 39.2201 });
  };

  const handleDelete = async (id: string
