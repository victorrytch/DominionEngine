interface DTOCompatible<V extends DTO> {

  // constructFromDTO(dto: V);
   convertToDTO(): V;

}