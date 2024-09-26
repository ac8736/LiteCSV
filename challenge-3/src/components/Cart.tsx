import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
import { Domain } from "./utils/types";

export default function Cart({
  cart,
  maxDomains,
  removeDomain,
  isOpen,
  onClose,
}: {
  cart: Domain[];
  maxDomains: number;
  removeDomain: (domain: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Domains</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="400px" overflowY="auto">
          {cart.length === 0 && <Text>Your cart is empty. Add some domains.</Text>}
          {cart.map((item, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center" padding={3}>
              <Text>
                {item.domain} - {item.available ? "Available" : "Unavailable"}
              </Text>
              <Button colorScheme="red" onClick={() => removeDomain(item.domain)}>
                Remove
              </Button>
            </Stack>
          ))}
        </ModalBody>

        <ModalFooter justifyContent="center" flexDirection="column">
          <Button colorScheme="blue" mr={3} onClick={onClose} isDisabled={cart.length !== maxDomains}>
            Purchase
          </Button>
          {cart.length < maxDomains && (
            <Text padding={3}>You need to add {maxDomains - cart.length} more domains.</Text>
          )}
          {cart.length > maxDomains && <Text padding={3}>You need to remove {cart.length - maxDomains} domains.</Text>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
