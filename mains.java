import java.util.Scanner;

public class mains{

    public static void main(String[] args){


        String frase = "LA CODIFICACION HUFFMAN ES UN METODO PARA CREAR CODIGOS PREFIJO TAN EXTENDIDO QUE EL TERMINO CODIFICACION HUFFMAN ES AMPLIAMENTE USADO COMO SINONIMO DE CODIGO PREFIJO INCLUSO CUANDO DICHO CODIGO NO SE HA PRODUCIDO CON EL ALGORITMO DE HUFFMAN";

        contarCaracteres(frase);

    }

    public static void contarCaracteres(String frase) {
        int y = 0;
        int vecesLetra[];
        vecesLetra = new int[26];

        for(y = 0; y<frase.length(); y++) {
            // Está en el abecedario y no es otro carácter como un espacio
            if((int)frase.charAt(y) >= 97 && (int)frase.charAt(y)<=172)
                vecesLetra[ (int)frase.charAt(y)-97 ]++;

        }

        for(y=0 ; y < vecesLetra.length; y++){
            if(vecesLetra[y]>0){
                System.out.println("La palabra "+(char)(y+97)+" tiene "+vecesLetra[y]+" letras");
            }
        }
    }
}