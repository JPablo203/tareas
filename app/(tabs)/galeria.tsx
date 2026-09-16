import React, { useState } from 'react';
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
  ImageSourcePropType,
  ImageResizeMode,
} from 'react-native';

// Definición del tipo para cada producto
interface Producto {
  id: string;
  titulo: string;
  precio: number;
  descripcion: string;
  imagen: ImageSourcePropType; // Soporta tanto require(...) como { uri: '...' }
}

// Datos iniciales cumpliendo la consigna de imagen local y remota
const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: '1',
    titulo: 'Icono Local Expo',
    precio: 1500,
    descripcion: 'Producto que carga una imagen local usando require(...).',
    imagen: require('../../assets/icon.jpeg'), // Ajustá la ruta según la ubicación de tu archivo
  },
  {
    id: '2',
    titulo: 'Auriculares Inalámbricos',
    precio: 8500,
    descripcion: 'Auriculares de alta fidelidad con cancelación de ruido activa.',
    imagen: { uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  },
  {
    id: '3',
    titulo: 'Smartwatch Deportivo',
    precio: 12000,
    descripcion: 'Reloj inteligente con monitor de ritmo cardíaco y GPS integrado.',
    imagen: { uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  },
  {
    id: '4',
    titulo: 'Cámara Vintage',
    precio: 23000,
    descripcion: 'Cámara clásica analógica para fotografía urbana y retratos.',
    imagen: { uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80' },
  },
];

export default function GaleriaScreen() {
  const [busqueda, setBusqueda] = useState<string>('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [resizeModeModal, setResizeModeModal] = useState<ImageResizeMode>('cover');

  // Filtrado en tiempo real por título
  const productosFiltrados = PRODUCTOS_INICIALES.filter((item) =>
    item.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Alternar favorito usando onLongPress
  const toggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Renderizado individual para FlatList
  const renderItem = ({ item }: { item: Producto }) => {
    const esFavorito = favoritos.includes(item.id);

    return (
      <Pressable
        style={[styles.card, esFavorito && styles.cardFavorito]}
        onPress={() => {
          setResizeModeModal('cover'); // Reset al abrir
          setProductoSeleccionado(item);
        }}
        onLongPress={() => toggleFavorito(item.id)}
      >
        <Image source={item.imagen} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.cardInfo}>
          <View style={styles.headerCard}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            {esFavorito && <Text style={styles.badgeFavorito}>★ Favorito</Text>}
          </View>
          <Text style={styles.cardPrecio}>${item.precio.toLocaleString('es-AR')}</Text>
          <Text style={styles.cardHint}>Mantené presionado para favoritar</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de búsqueda con TextInput */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto por título..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Lista optimizada con FlatList */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron productos coincidentes.</Text>
        }
      />

      {/* Modal de Detalle */}
      <Modal
        visible={productoSeleccionado !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProductoSeleccionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {productoSeleccionado && (
              <>
                {/* Imagen grande con resizeMode dinámico */}
                <View style={styles.modalImageWrapper}>
                  <Image
                    source={productoSeleccionado.imagen}
                    style={styles.modalImage}
                    resizeMode={resizeModeModal}
                  />
                </View>

                {/* Controles de resizeMode */}
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

                <Text style={styles.modalTitulo}>{productoSeleccionado.titulo}</Text>
                <Text style={styles.modalPrecio}>
                  ${productoSeleccionado.precio.toLocaleString('es-AR')}
                </Text>
                <Text style={styles.modalDescripcion}>
                  {productoSeleccionado.descripcion}
                </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setProductoSeleccionado(null)}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    fontSize: 16,
    color: '#0f172a',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cardFavorito: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  thumbnail: {
    width: 70,
    height: 70,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  badgeFavorito: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: 'bold',
  },
  cardPrecio: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 4,
  },
  cardHint: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
    fontSize: 15,
  },
  // Modal
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
    height: 200,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  resizeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalPrecio: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    marginVertical: 6,
  },
  modalDescripcion: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});