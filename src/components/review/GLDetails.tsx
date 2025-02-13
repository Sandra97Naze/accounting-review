import { GrandLivreEntry } from '@/types/types';

interface GLDisplayEntry {
  compte: string;
  libelle: string;
  solde: number;
  variation?: number;
}

const GLDetails: React.FC<{ data: GLDisplayEntry[] }> = ({ data }) => {
  return (
    <div className="mt-4">
      <table className="w-full">
        <thead>
          <tr>
            <th>Compte</th>
            <th>Libellé</th>
            <th>Solde N</th>
            <th>Variation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.compte}</td>
              <td>{entry.libelle}</td>
              <td>{entry.solde.toLocaleString('fr-FR')} €</td>
              <td>{entry.variation?.toLocaleString('fr-FR')} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GLDetails;
