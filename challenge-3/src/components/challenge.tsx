import { ChangeEvent, useState } from "react";
import { Box, Input, Text, Heading, Stack, Button, useDisclosure } from "@chakra-ui/react";
import { checkForDuplicateDomain, validateDomain, sortDomains } from "./utils/helper";
import { isDomainAvailable } from "@/lib/resources";
import { Domain } from "./utils/types";
import { useCustomToast } from "./utils/toast";
import Cart from "./Cart";
import ErrorMessage from "./ErrorMessage";

export interface ChallengeProps {
  /**
   * The maximum number of domains the user is allowed to have
   * in their cart. Invalid domains count toward this limit as well.
   */
  maxDomains: number;
}

export function Challenge(props: ChallengeProps) {
  const { maxDomains } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useCustomToast();

  const [domain, setDomain] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [cart, setCart] = useState<Domain[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Handles submission of user's domain. Validates the domain and adds it to the cart.
   *
   * @returns
   */
  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    // Validate the domain
    const error = validateDomain(domain);
    if (error !== "") {
      setErrorMsg(error);
      return;
    } else {
      setErrorMsg("");
    }

    try {
      setIsSubmitting(true);
      const available = await isDomainAvailable(domain);
      const domainLower = domain.toLowerCase();

      // Check if domain is already in the cart
      if (!checkForDuplicateDomain(domainLower, cart)) {
        showToast({
          title: "Successful submission.",
          description: "We've added to the cart.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setCart([...cart, { domain: domainLower, available }]);
      } else {
        showToast({
          title: "Unsuccessful submission.",
          description: "Domain already in cart.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      setDomain("");
      setIsSubmitting(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  /**
   * Clears the cart.
   */
  function clearCart() {
    setCart([]);
    showToast({
      title: "Cleared cart.",
      description: "Your cart has been cleared.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  /**
   * Copies the cart contents to the clipboard.
   */
  function copyCartToClipboard() {
    const domains = cart.map((item) => item.domain).join(", ");
    navigator.clipboard.writeText(domains);
    showToast({
      title: "Copied to clipboard.",
      description: "Your cart has been copied to the clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  /**
   * Removes all unavailable domains from the cart.
   */
  function removeUnavailableDomains() {
    setCart(cart.filter((item) => item.available));
    showToast({
      title: "Removed unavailable domains.",
      description: "All unavailable domains have been removed from the cart.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  /**
   * Keeps only the best {maxDomains} domains in the cart.
   */
  function keepOnlyBestDomains() {
    const sortedCart = sortDomains(cart);
    setCart(sortedCart.slice(0, maxDomains));
    showToast({
      title: "Kept only best domains.",
      description: "Only the best domains have been kept in the cart.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  /**
   * Removes a domain from the cart.
   *
   * @param domainToRemove The domain to remove from the cart.
   */
  function removeDomain(domainToRemove: string) {
    setCart(cart.filter((item) => item.domain !== domainToRemove));
  }

  return (
    <>
      <Box>
        <Stack spacing={5}>
          <Heading as="h1" size="xl" textAlign="center">
            Domain Shop
          </Heading>
          <Stack>
            <Text>Type your domain here</Text>
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDomain(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </Stack>
          <Button colorScheme="teal" variant="solid" onClick={handleSubmit}>
            Add to cart
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={onOpen}>
            View cart
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={copyCartToClipboard}>
            Copy cart to clipboard
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={removeUnavailableDomains}>
            Remove unavailable domains
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={clearCart}>
            Clear cart
          </Button>
          <Button colorScheme="teal" variant="solid" onClick={keepOnlyBestDomains}>
            Keep only best domains
          </Button>
        </Stack>
        <ErrorMessage errorMsg={errorMsg} />
      </Box>

      <Cart cart={cart} maxDomains={maxDomains} removeDomain={removeDomain} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
