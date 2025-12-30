/**
 * Script para migrar productos desde products.json a Supabase
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env
 * 2. Ejecuta: node scripts/migrateProductsToSupabase.js
 * 
 * O si tienes tsx instalado:
 * npx tsx scripts/migrateProductsToSupabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Asegúrate de tener PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu archivo .env');
  console.error('\nEjemplo de .env:');
  console.error('PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.error('PUBLIC_SUPABASE_ANON_KEY=tu-publishable-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Cargar productos desde el JSON
const productsPath = join(__dirname, '../src/data/products.json');
const productsData = JSON.parse(readFileSync(productsPath, 'utf-8'));

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos a Supabase...\n');
  console.log(`📦 Productos a migrar: ${productsData.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
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
        console.log(`   ✅ Actualizado: ${product.nombre.substring(0, 50)}...`);
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
        console.log(`   ✅ Creado: ${product.nombre.substring(0, 50)}...`);
      }

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error con producto "${product.id}":`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Productos migrados exitosamente: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📦 Total procesados: ${productsData.length}`);
}

// Ejecutar migración
migrateProducts()
  .then(() => {
    console.log('\n✨ Migración completada!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Verifica los productos en el dashboard de Supabase');
    console.log('   2. Las imágenes están usando rutas relativas (/productos/...)');
    console.log('   3. Asegúrate de que las imágenes existan en public/productos/');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });

