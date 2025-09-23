<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('unit_type'); // 'kg', 'karung', 'ton', 'pieces', 'ikat'
            $table->string('unit_label'); // 'Kilogram', 'Karung (25kg)', 'Ton', 'Buah', 'Ikat'
            $table->decimal('price_per_unit', 15, 2);
            $table->decimal('stock_quantity', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0); // urutan display (kg -> karung -> ton)
            $table->text('notes')->nullable(); // catatan khusus per unit
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_units');
    }
};
