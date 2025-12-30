/**
 * Script para migrar productos desde products.json a Supabase
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env
 * 2. Ejecuta: npx tsx scripts/migrateProductsToSupabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import productsData from '../src/data/products.json';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Asegúrate de tener PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  modelos_compatibles: string[];
  imagen: string | string[];
}

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos a Supabase...\n');

  const products = productsData as Product[];
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // Verificar si el producto ya existe
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('id', product.id)
        .single();

      if (existing) {
        console.log(`⚠️  Producto "${product.id}" ya existe, actualizando...`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({
            nombre: product.nombre,
            descripcion: product.descripcion,
            modelos_compatibles: product.modelos_compatibles,
            imagen: product.imagen,
          })
          .eq('id', product.id);

        if (updateError) throw updateError;
        console.log(`✅ Actualizado: ${product.nombre}`);
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([{
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            modelos_compatibles: product.modelos_compatibles,
            imagen: product.imagen,
          }]);

        if (insertError) throw insertError;
        console.log(`✅ Creado: ${product.nombre}`);
      }

      successCount++;
    } catch (error: any) {
      console.error(`❌ Error con producto "${product.id}":`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`✅ Productos migrados exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📦 Total: ${products.length}`);
}

// Ejecutar migración
migrateProducts()
  .then(() => {
    console.log('\n✨ Migración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });

