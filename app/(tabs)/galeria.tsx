import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  Modal,
  StyleSheet,
  ImageResizeMode,
  Alert,
} from 'react-native';


export const API_URL = 'http://10.249.83.201:3000';

interface Enano {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  imagen: string;
  edad: number;
}

export default function GaleriaScreen() {
  const [enanos, setEnanos] = useState<Enano[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [enanoSeleccionado, setEnanoSeleccionado] = useState<Enano | null>(null);
  const [resizeModeModal, setResizeModeModal] = useState<ImageResizeMode>('cover');

  // Estados para el formulario de alta (Parte A)
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaEdad, setNuevaEdad] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // 1. Obtener Enanos desde el Backend (SQLite vía Prisma)
  const fetchEnanos = async () => {
    try {
      const res = await fetch(`${API_URL}/enanos`);
      if (res.ok) {
        const data = await res.json();
        setEnanos(data);
      }
    } catch (error) {
      console.log('Error al conectar con el backend:', error);
    }
  };

  useEffect(() => {
    fetchEnanos();
  }, []);

  // 2. PARTE A: Crear un nuevo enano ingresando la edad desde el TextInput
  const crearEnano = async () => {
    if (!nuevoTitulo.trim() || !nuevaEdad.trim()) {
      Alert.alert('Atención', 'Completá al menos el nombre y la edad');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/enanos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: nuevoTitulo,
          edad: parseInt(nuevaEdad, 10) || 0,
          precio: parseFloat(nuevoPrecio) || 1500,
          descripcion: `Enano de ${nuevaEdad} años de edad`,
          imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        }),
      });

      if (res.ok) {
        setNuevoTitulo('');
        setNuevaEdad('');
        setNuevoPrecio('');
        fetchEnanos(); // Recargar datos de la base de datos
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar en la base de datos');
    }
  };

  // 3. PARTE B: Eliminar enano de la base de datos
  const eliminarEnano = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/enanos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok || res.status === 204) {
        setEnanos((prev) => prev.filter((item) => item.id !== id));
      } else {
        Alert.alert('Error', 'No se pudo eliminar el enano');
      }
    } catch (error) {
      Alert.alert('Error', 'Fallo de conexión al eliminar');
    }
  };

  // Filtrado en tiempo real
  const productosFiltrados = enanos.filter((item) =>
    item.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Enano }) => {
    const esFavorito = favoritos.includes(item.id);

    return (
      <Pressable
        style={[styles.card, esFavorito && styles.cardFavorito]}
        onPress={() => {
          setResizeModeModal('cover');
          setEnanoSeleccionado(item);
        }}
        onLongPress={() => toggleFavorito(item.id)}
      >
        <Image source={{ uri: item.imagen }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <View style={styles.headerCard}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            {esFavorito && <Text style={styles.badgeFavorito}>★ Favorito</Text>}
          </View>
          <Text style={styles.cardEdad}>Edad: {item.edad} años</Text>
          <Text style={styles.cardPrecio}>${item.precio.toLocaleString('es-AR')}</Text>
          <Text style={styles.cardHint}>Mantené presionado para favoritar</Text>
        </View>

        {/* PARTE B: Botón dentro de la tarjeta para eliminar de la db */}
        <Pressable
          style={styles.btnEliminar}
          onPress={(e) => {
            e.stopPropagation();
            eliminarEnano(item.id);
          }}
        >
          <Text style={styles.btnEliminarTexto}>Eliminar</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* PARTE A: Formulario con TextInput para ingresar la edad */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitulo}>Agregar Nuevo Enano</Text>
        <TextInput
          style={styles.inputForm}
          placeholder="Nombre del Enano"
          value={nuevoTitulo}
          onChangeText={setNuevoTitulo}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={styles.inputForm}
          placeholder="Edad del Enano (TextInput requerido)"
          value={nuevaEdad}
          onChangeText={setNuevaEdad}
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={styles.inputForm}
          placeholder="Precio"
          value={nuevoPrecio}
          onChangeText={setNuevoPrecio}
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />
        <Pressable style={styles.btnGuardar} onPress={crearEnano}>
          <Text style={styles.btnGuardarTexto}>Guardar en la DB</Text>
        </Pressable>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar enano por título..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* FlatList con tarjetas */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay enanos registrados en la DB.</Text>
        }
      />

      {/* Modal de Detalle */}
      <Modal
        visible={enanoSeleccionado !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEnanoSeleccionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {enanoSeleccionado && (
              <>
                <View style={styles.modalImageWrapper}>
                  <Image
                    source={{ uri: enanoSeleccionado.imagen }}
                    style={styles.modalImage}
                    resizeMode={resizeModeModal}
                  />
                </View>

                <Text style={styles.selectorLabel}>Ajuste de Imagen (resizeMode):</Text>
                <View style={styles.resizeButtonsRow}>
                  {(['cover', 'contain', 'stretch'] as ImageResizeMode[]).map((mode) => (
                    <Pressable
                      key={mode}
                      style={[
                        styles.modeButton,
                        resizeModeModal === mode && styles.modeButtonActive,
                      ]}
                      onPress={() => setResizeModeModal(mode)}
                    >
                      <Text
                        style={[
                          styles.modeButtonText,
                          resizeModeModal === mode && styles.modeButtonTextActive,
                        ]}
                      >
                        {mode}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.modalTitulo}>{enanoSeleccionado.titulo}</Text>
                <Text style={styles.modalEdad}>Edad: {enanoSeleccionado.edad} años</Text>
                <Text style={styles.modalPrecio}>
                  ${enanoSeleccionado.precio.toLocaleString('es-AR')}
                </Text>
                <Text style={styles.modalDescripcion}>
                  {enanoSeleccionado.descripcion}
                </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setEnanoSeleccionado(null)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  formContainer: {
    padding: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  formTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  inputForm: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 6,
    fontSize: 14,
  },
  btnGuardar: {
    backgroundColor: '#2563eb',
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 2,
  },
  btnGuardarTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    fontSize: 15,
    color: '#0f172a',
  },
  listContainer: {
    padding: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cardFavorito: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  badgeFavorito: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: 'bold',
  },
  cardEdad: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  cardPrecio: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 2,
  },
  cardHint: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  btnEliminar: {
    backgroundColor: '#ef4444',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 6,
  },
  btnEliminarTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#64748b',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalImageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  resizeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  modeButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalEdad: {
    fontSize: 14,
    color: '#475569',
    marginVertical: 2,
  },
  modalPrecio: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginVertical: 4,
  },
  modalDescripcion: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 9,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});